import {OpenAICompletionResponse} from "../helpers/types";
import ReactDOM from "react-dom/client";
import React from "react";
import {IoIosRemoveCircle} from "react-icons/io";

/**
 * It will inject the summary into the page.
 * @param summary
 */
export function embedSalaryIntoPage(summary: OpenAICompletionResponse) {
    document.getElementById("ghost-reader-root")?.remove();

    const div = document.createElement("div");
    div.id = "ghost-reader-root";
    document.body.appendChild(div);

    const root = ReactDOM.createRoot(document.getElementById("ghost-reader-root")!);
    root.render(<Summary text={summary.choices[0].text}/>);
}

function Summary({text}) {

    function handleRemove() {
        document.getElementById("ghost-reader-root")?.remove();
    }

    return <div className="ghost-summary">
        <button className="ghost-remove-button" onClick={handleRemove}><IoIosRemoveCircle/></button>
        {text}
    </div>
}