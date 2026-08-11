from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi import (
    FastAPI,
    File,
    UploadFile,
    HTTPException
)

from app.schemas import PredictionResponse
from app.model import (
    predict_damage,
    MODEL_PATH
)


app = FastAPI(
    title="DisasterDiff API",

    description=(
        "Deep learning API for building damage "
        "severity assessment using pre- and "
        "post-disaster satellite imagery."
    ),

    version="1.0.0"
)
app.mount(
    "/static",
    StaticFiles(directory="frontend"),
    name="static"
)


@app.get("/")
def root():
    return FileResponse(
        "frontend/index.html"
    )

@app.get("/ui")
def frontend():
    return FileResponse(
        "frontend/index.html"
    )


@app.get("/health")
def health_check():

    return {
        "status": "healthy",

        "model_available":
            MODEL_PATH.exists()
    }


@app.post(
    "/predict",
    response_model=PredictionResponse
)
async def predict(

    before_image: UploadFile = File(...),

    after_image: UploadFile = File(...)
):

    allowed_types = {
        "image/jpeg",
        "image/jpg",
        "image/png"
    }


    if (
        before_image.content_type
        not in allowed_types
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "before_image must be "
                "JPEG or PNG"
            )
        )


    if (
        after_image.content_type
        not in allowed_types
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "after_image must be "
                "JPEG or PNG"
            )
        )


    before_bytes = await (
        before_image.read()
    )

    after_bytes = await (
        after_image.read()
    )


    try:

        result = predict_damage(
            before_bytes,
            after_bytes
        )

        return result


    except FileNotFoundError:

        raise HTTPException(
            status_code=503,
            detail=(
                "Model checkpoint is not "
                "available yet."
            )
        )


    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )