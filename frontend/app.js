// =========================================================
// DOM ELEMENTS
// =========================================================

const beforeInput =
    document.getElementById("beforeImage");


const afterInput =
    document.getElementById("afterImage");


const predictButton =
    document.getElementById("predictButton");


const exampleButton =
    document.getElementById("exampleButton");


const exampleButtonText =
    document.getElementById("exampleButtonText");


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



// Hide immediately when JavaScript loads

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


    document
        .getElementById(
            "apiStatusText"
        )
        .textContent =
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

        console.error(
            "Health check error:",
            error
        );


        setApiStatus(
            "offline",
            "API offline"
        );

    }

}





// =========================================================
// PREDICTION BUTTON STATE
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





    function render(file) {

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





    // Manual file selection

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





    // Handle drag-drop files

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





// Initialize uploaders

setupUploader(
    "before",
    beforeInput
);


setupUploader(
    "after",
    afterInput
);





// =========================================================
// EXAMPLE IMAGE LOADER
// =========================================================

async function loadExampleFile(
    url,
    filename,
    input
) {

    const response =
        await fetch(
            url,
            {
                cache:
                    "no-store"
            }
        );


    if (!response.ok) {

        throw new Error(
            `Could not load ${filename}`
        );

    }


    const blob =
        await response.blob();


    const file =
        new File(
            [blob],
            filename,
            {
                type:
                    blob.type
                    ||
                    "image/jpeg"
            }
        );


    const transfer =
        new DataTransfer();


    transfer.items.add(
        file
    );


    input.files =
        transfer.files;



    // Existing uploader listens for this event.
    // This automatically renders the preview.

    input.dispatchEvent(

        new Event(
            "change",
            {
                bubbles:
                    true
            }
        )

    );

}





exampleButton.addEventListener(

    "click",

    async () => {

        try {

            hideError();


            resultCard.hidden =
                true;


            exampleButton.disabled =
                true;


            exampleButtonText.textContent =
                "Loading example...";



            await loadExampleFile(

                "/static/examples/before.png",

                "before.png",

                beforeInput

            );



            await loadExampleFile(

                "/static/examples/after.png",

                "after.png",

                afterInput

            );



            updateButtonState();



            exampleButtonText.textContent =
                "Example loaded ✓";



            setTimeout(

                () => {

                    exampleButton.disabled =
                        false;


                    exampleButtonText.textContent =
                        "Try destroyed example";

                },

                1500

            );

        }


        catch (error) {

            console.error(
                "Example loading error:",
                error
            );


            exampleButton.disabled =
                false;


            exampleButtonText.textContent =
                "Try destroyed example";


            showError(
                "Could not load the example images."
            );

        }

    }

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


    exampleButton.disabled =
        loading;


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

function renderResults(data) {


    // Successful prediction hides old errors

    hideError();



    const prediction =
        data.prediction;


    const confidence =
        Number(
            data.confidence
            ||
            0
        );





    // =====================================================
    // SEVERITY BADGE
    // =====================================================

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





    // =====================================================
    // CONFIDENCE
    // =====================================================

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





    // =====================================================
    // PROBABILITY BARS
    // =====================================================

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





    // =====================================================
    // ASSESSMENT NOTE
    // =====================================================

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





    // =====================================================
    // DISPLAY RESULT
    // =====================================================

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





        // Make sure both images exist

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





        hideError();


        setLoading(
            true
        );





        const formData =
            new FormData();





        // Names must match FastAPI parameters

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





            renderResults(
                data
            );

        }





        catch (error) {


            console.error(
                "Prediction error:",
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