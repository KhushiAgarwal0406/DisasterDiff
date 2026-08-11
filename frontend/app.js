// =========================================================
// DOM ELEMENTS
// =========================================================

const beforeInput =
    document.getElementById("beforeImage");

const afterInput =
    document.getElementById("afterImage");

const predictButton =
    document.getElementById("predictButton");

const buttonText =
    document.getElementById("buttonText");

const buttonArrow =
    document.getElementById("buttonArrow");

const spinner =
    document.getElementById("spinner");

const resultCard =
    document.getElementById("resultCard");

const errorBanner =
    document.getElementById("errorBanner");

const errorText =
    document.getElementById("errorText");

const dismissError =
    document.getElementById("dismissError");



// =========================================================
// DAMAGE CLASS TEXT
// =========================================================

const classCopy = {

    "no-damage":
        "The model finds the pair most consistent with an intact or minimally changed structure.",

    "minor-damage":
        "The model detects limited structural or roof-level changes consistent with minor damage.",

    "major-damage":
        "The model detects substantial visual change consistent with major building damage.",

    "destroyed":
        "The model detects severe structural loss or disappearance consistent with destruction."

};



const classLabels = {

    "no-damage":
        "No damage",

    "minor-damage":
        "Minor damage",

    "major-damage":
        "Major damage",

    "destroyed":
        "Destroyed"

};



// =========================================================
// ERROR HANDLING
// =========================================================

function hideError() {

    errorBanner.classList.add(
        "is-hidden"
    );

}


function showError(message) {

    errorText.textContent =
        message;

    errorBanner.classList.remove(
        "is-hidden"
    );

    errorBanner.scrollIntoView({

        behavior:
            "smooth",

        block:
            "nearest"

    });

}



// Hide it immediately when JS loads
hideError();



// Dismiss button

dismissError.addEventListener(

    "click",

    hideError

);



// =========================================================
// API STATUS
// =========================================================

function setApiStatus(
    state,
    label
) {

    const box =
        document.getElementById(
            "apiStatus"
        );

    box.classList.remove(
        "online",
        "offline"
    );


    if (state) {

        box.classList.add(
            state
        );

    }


    document.getElementById(
        "apiStatusText"
    ).textContent =
        label;

}



async function checkApi() {

    try {

        const response =
            await fetch(
                "/health",
                {
                    cache:
                        "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Health check failed"
            );

        }


        const data =
            await response.json();


        if (
            data.model_available
        ) {

            setApiStatus(
                "online",
                "Model online"
            );

        }

        else {

            setApiStatus(
                "offline",
                "Model unavailable"
            );

        }

    }

    catch (error) {

        setApiStatus(
            "offline",
            "API offline"
        );

    }

}



// =========================================================
// BUTTON STATE
// =========================================================

function updateButtonState() {

    const hasBefore =
        Boolean(
            beforeInput.files[0]
        );

    const hasAfter =
        Boolean(
            afterInput.files[0]
        );


    predictButton.disabled =
        !(
            hasBefore
            &&
            hasAfter
        );

}



// =========================================================
// IMAGE UPLOADER
// =========================================================

function setupUploader(
    prefix,
    input
) {

    const dropzone =
        document.getElementById(
            prefix
            +
            "Dropzone"
        );


    const empty =
        document.getElementById(
            prefix
            +
            "Empty"
        );


    const previewWrap =
        document.getElementById(
            prefix
            +
            "PreviewWrap"
        );


    const preview =
        document.getElementById(
            prefix
            +
            "Preview"
        );


    const filename =
        document.getElementById(
            prefix
            +
            "Filename"
        );



    function render(
        file
    ) {

        if (!file) {

            return;

        }


        const imageUrl =
            URL.createObjectURL(
                file
            );


        preview.src =
            imageUrl;


        filename.textContent =
            file.name;


        empty.hidden =
            true;


        previewWrap.hidden =
            false;


        updateButtonState();

    }



    input.addEventListener(

        "change",

        () => {

            render(
                input.files[0]
            );

        }

    );



    // Drag-over styling

    [
        "dragenter",
        "dragover"
    ].forEach(

        eventName => {

            dropzone.addEventListener(

                eventName,

                event => {

                    event.preventDefault();

                    dropzone.classList.add(
                        "dragover"
                    );

                }

            );

        }

    );



    [
        "dragleave",
        "drop"
    ].forEach(

        eventName => {

            dropzone.addEventListener(

                eventName,

                event => {

                    event.preventDefault();

                    dropzone.classList.remove(
                        "dragover"
                    );

                }

            );

        }

    );



    // Handle drag-drop file

    dropzone.addEventListener(

        "drop",

        event => {

            const file =
                event
                .dataTransfer
                .files[0];


            if (!file) {

                return;

            }


            const transfer =
                new DataTransfer();


            transfer.items.add(
                file
            );


            input.files =
                transfer.files;


            render(
                file
            );

        }

    );

}



// Initialize both uploaders

setupUploader(
    "before",
    beforeInput
);


setupUploader(
    "after",
    afterInput
);



// =========================================================
// REPLACE BUTTONS
// =========================================================

document
    .querySelectorAll(
        ".replace-button"
    )
    .forEach(

        button => {

            button.addEventListener(

                "click",

                event => {

                    event.preventDefault();

                    event.stopPropagation();


                    document
                        .getElementById(
                            button.dataset.target
                        )
                        .click();

                }

            );

        }

    );



// =========================================================
// LOADING STATE
// =========================================================

function setLoading(
    loading
) {

    predictButton.disabled =
        loading
        ||
        !(
            beforeInput.files[0]
            &&
            afterInput.files[0]
        );


    buttonText.textContent =
        loading
        ?
        "Analyzing imagery"
        :
        "Analyze damage";


    buttonArrow.hidden =
        loading;


    spinner.hidden =
        !loading;

}



// =========================================================
// RESULT RENDERING
// =========================================================

function renderResults(
    data
) {

    /*
        VERY IMPORTANT:

        Successful prediction always
        hides any previous error.
    */

    hideError();



    const prediction =
        data.prediction;


    const confidence =
        Number(
            data.confidence
            ||
            0
        );



    // ===============================
    // Severity badge
    // ===============================

    const badge =
        document.getElementById(
            "severityBadge"
        );


    badge.textContent =
        classLabels[
            prediction
        ]
        ||
        prediction;


    badge.className =
        "severity-badge severity-"
        +
        prediction;



    // ===============================
    // Confidence
    // ===============================

    document
        .getElementById(
            "confidenceValue"
        )
        .textContent =

        (
            confidence
            *
            100
        ).toFixed(1)
        +
        "%";



    document
        .getElementById(
            "confidenceRing"
        )
        .style
        .setProperty(

            "--score",

            (
                confidence
                *
                100
            ).toFixed(2)

        );



    // ===============================
    // Probability bars
    // ===============================

    const probabilityList =
        document.getElementById(
            "probabilityList"
        );


    probabilityList.innerHTML =
        "";



    const classes = [

        "no-damage",

        "minor-damage",

        "major-damage",

        "destroyed"

    ];



    classes.forEach(

        label => {

            const probability =
                Number(

                    data
                    .probabilities
                    ?.[label]

                    ||
                    0

                );


            const percentage =
                probability
                *
                100;



            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "probability-row";



            row.innerHTML = `

                <div class="probability-label">
                    ${classLabels[label]}
                </div>

                <div class="probability-track">

                    <div
                        class="probability-fill"
                        data-width="${percentage.toFixed(2)}"
                    >
                    </div>

                </div>

                <div class="probability-value">
                    ${percentage.toFixed(1)}%
                </div>

            `;


            probabilityList.appendChild(
                row
            );

        }

    );



    // Animate probability bars

    requestAnimationFrame(

        () => {

            document
                .querySelectorAll(
                    ".probability-fill"
                )
                .forEach(

                    fill => {

                        fill.style.width =
                            fill.dataset.width
                            +
                            "%";

                    }

                );

        }

    );



    // ===============================
    // Assessment explanation
    // ===============================

    document
        .getElementById(
            "assessmentNote"
        )
        .textContent =

        classCopy[
            prediction
        ]

        ||

        "Assessment generated from the uploaded image pair.";



    // ===============================
    // Display result
    // ===============================

    resultCard.hidden =
        false;



    resultCard.scrollIntoView({

        behavior:
            "smooth",

        block:
            "start"

    });

}



// =========================================================
// PREDICTION
// =========================================================

predictButton.addEventListener(

    "click",

    async () => {


        const beforeFile =
            beforeInput.files[0];


        const afterFile =
            afterInput.files[0];



        // Ensure both images exist

        if (
            !beforeFile
            ||
            !afterFile
        ) {

            showError(
                "Please select both the before and after images."
            );

            return;

        }



        /*
            Clear old error BEFORE
            starting a new prediction.
        */

        hideError();


        setLoading(
            true
        );



        const formData =
            new FormData();



        /*
            These names MUST match
            FastAPI exactly.
        */

        formData.append(

            "before_image",

            beforeFile

        );


        formData.append(

            "after_image",

            afterFile

        );



        try {


            const response =
                await fetch(

                    "/predict",

                    {

                        method:
                            "POST",

                        body:
                            formData

                    }

                );



            let data = {};


            try {

                data =
                    await response.json();

            }

            catch (jsonError) {

                data = {};

            }



            if (
                !response.ok
            ) {

                throw new Error(

                    data.detail

                    ||

                    `Prediction failed (${response.status})`

                );

            }



            /*
                Prediction succeeded.

                renderResults()
                also calls hideError().
            */

            renderResults(
                data
            );

        }



        catch (error) {


            console.error(
                error
            );


            showError(

                error.message

                ||

                "Something went wrong."

            );

        }



        finally {


            setLoading(
                false
            );

        }

    }

);



// =========================================================
// INITIAL API CHECK
// =========================================================

checkApi();