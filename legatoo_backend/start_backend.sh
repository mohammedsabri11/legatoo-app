source /root/legatoo_backend/venv/bin/activate
exec uvicorn app.main:app \
     --host 0.0.0.0 \
     --port 8000 \
     --env-file /root/legatoo_backend/.env.production