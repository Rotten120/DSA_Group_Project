:: SETUPS VIRTUAL ENVIRONMENT 

python -m venv venv

:: macOS/Linux (works for git bash)
source venv/Scripts/activate

:: windows (works for terminal)
:: do not execute script in windows powershell
call venv/Scripts/activate

pip install -r requirements.txt
deactivate
