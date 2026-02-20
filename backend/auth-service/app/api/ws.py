from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query, Depends, status
from app.core.websocket import manager
from app.core import security
from app.core.crud_s3 import get_user_by_username # or get_user_by_id if needed
from jose import JWTError, jwt
from app.core.config import settings

router = APIRouter()

async def get_current_user_ws(token: str = Query(...)):
    from fastapi import HTTPException
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=403, detail="Invalid token payload")
        return username
    except jwt.ExpiredSignatureError:
        print("WebSocket token has expired")
        raise HTTPException(status_code=403, detail="Token expired")
    except JWTError as e:
        print(f"WebSocket JWT error: {e}")
        raise HTTPException(status_code=403, detail="Invalid token")

@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket, 
    current_user: str = Depends(get_current_user_ws)
):
    print(f"WebSocket authenticated for user: {current_user}")
    try:
        await manager.connect(websocket, current_user)
        print(f"WebSocket connected for user: {current_user}")
        while True:
            # Keep alive and wait for messages
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        print(f"WebSocket disconnected for user: {current_user}")
        manager.disconnect(websocket, current_user)
    except Exception as e:
        print(f"WebSocket error for {current_user}: {e}")
        try:
            manager.disconnect(websocket, current_user)
        except:
            pass

