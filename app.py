import json
import os
import secrets
from pathlib import Path
from threading import Timer
import webbrowser

from flask import Flask, abort, jsonify, redirect, request, send_from_directory, session, url_for
from google.auth.exceptions import GoogleAuthError
from google.auth.transport.requests import Request as GoogleRequest
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
from oauthlib.oauth2 import OAuth2Error
from requests.exceptions import RequestException


BASE_DIR = Path(__file__).resolve().parent
CLIENT_SECRETS_FILE = BASE_DIR / "client_secret_168034050814-gkt3gch93pvc94m1vesjud8aod3e9jc2.apps.googleusercontent.com.json"
SCOPES = ["openid", "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"]
CALLBACK_PATH = "/google_login/google/authorized"
ALLOWED_ASSETS = {"styles.css", "script.js", "logo.png"}
SESSION_SECRET = os.environ.get("FLASK_SECRET_KEY") or secrets.token_urlsafe(32)

if not CLIENT_SECRETS_FILE.is_file():
    raise FileNotFoundError(f"No se encontró el archivo de credenciales OAuth: {CLIENT_SECRETS_FILE.name}")

with CLIENT_SECRETS_FILE.open(encoding="utf-8") as credentials_file:
    oauth_config = json.load(credentials_file)

try:
    WEB_CONFIG = oauth_config["web"]
    GOOGLE_CLIENT_ID = WEB_CONFIG["client_id"]
    configured_redirects = WEB_CONFIG["redirect_uris"]
except (KeyError, TypeError) as exc:
    raise ValueError("El JSON de OAuth debe contener una configuración web y sus URI de redirección.") from exc

REDIRECT_URI = os.environ.get("GOOGLE_REDIRECT_URI", f"http://127.0.0.1:5000{CALLBACK_PATH}")
if REDIRECT_URI not in configured_redirects:
    raise ValueError("GOOGLE_REDIRECT_URI no está registrado en el JSON del cliente OAuth.")

app = Flask(__name__)
app.secret_key = SESSION_SECRET
app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=os.environ.get("SESSION_COOKIE_SECURE", "false").lower() == "true",
)


@app.get("/")
def home():
    return send_from_directory(BASE_DIR, "index.html")


@app.get("/<path:asset>")
def static_asset(asset):
    if asset not in ALLOWED_ASSETS:
        abort(404)
    return send_from_directory(BASE_DIR, asset)


def create_google_flow(state=None):
    return Flow.from_client_secrets_file(
        str(CLIENT_SECRETS_FILE),
        scopes=SCOPES,
        state=state,
        redirect_uri=REDIRECT_URI,
    )


@app.get("/google_login")
def google_login():
    flow = create_google_flow()
    authorization_url, state = flow.authorization_url(
        access_type="online",
        include_granted_scopes="true",
        prompt="select_account",
    )
    session["google_oauth_state"] = state
    return redirect(authorization_url)


@app.get(CALLBACK_PATH)
def google_authorized():
    if request.args.get("error"):
        return redirect(url_for("home", login_error=request.args["error"]))

    state = session.pop("google_oauth_state", None)
    if not state or request.args.get("state") != state or not request.args.get("code"):
        return redirect(url_for("home", login_error="invalid_state"))

    try:
        flow = create_google_flow(state=state)
        flow.fetch_token(authorization_response=request.url)
        if not flow.credentials.id_token:
            raise ValueError("Google no devolvió un token de identidad.")
        identity = id_token.verify_oauth2_token(
            flow.credentials.id_token,
            GoogleRequest(),
            GOOGLE_CLIENT_ID,
        )
        if identity.get("email_verified") is not True or not identity.get("sub") or not identity.get("email"):
            raise ValueError("La cuenta de Google no tiene un correo verificado.")

        session.clear()
        session["user"] = {
            "id": identity["sub"],
            "email": identity["email"],
            "name": identity.get("name") or identity["email"],
            "picture": identity.get("picture"),
        }
    except (ValueError, OSError, GoogleAuthError, OAuth2Error, RequestException) as exc:
        app.logger.warning("Falló la autenticación de Google (%s).", type(exc).__name__)
        return redirect(url_for("home", login_error="authentication_failed"))

    return redirect(url_for("home", login="success"))


@app.get("/api/session")
def api_session():
    user = session.get("user")
    if not user:
        return jsonify(authenticated=False)
    return jsonify(authenticated=True, user=user)


@app.post("/logout")
def logout():
    session.clear()
    return "", 204


def run():
    address = "http://127.0.0.1:5000"
    print("AccedeED y el inicio de sesión de Google estarán disponibles en:")
    print(f"  {address}")
    print("Mantén esta ventana abierta mientras usas AccedeED. Cierra con Ctrl+C.")
    Timer(1.0, webbrowser.open, args=[address]).start()
    app.run(host="127.0.0.1", port=5000, debug=False)


if __name__ == "__main__":
    run()
