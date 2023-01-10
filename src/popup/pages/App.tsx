import React from "react";
import {useNavigate} from "react-router-dom";
import Header from "../components/Header";
import Loading from "../components/Loading";

function App() {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [error, setError] = React.useState("");


    async function handleSearch() {
        setLoading(true);
        const tabs = await chrome.tabs.query({active: true, currentWindow: true});
        const activeTab = tabs[0];

        if (!activeTab) {
            setLoading(false);
            setError("No active tab");
            return;
        }

        const response = await chrome.tabs.sendMessage(activeTab.id, {type: "search", search});

        if (!response) {
            setError("We messed up! Please try again.");
        } else if (response.error) {
            navigate("/error");
        } else if (response.lowConfidence) {
            setError("No relevant answers found!");
        } else {
            setError("");
        }

        setLoading(false);
    }

    async function handleSummarize() {
        setLoading(true);
        const tabs = await chrome.tabs.query({active: true, currentWindow: true});
        const activeTab = tabs[0];

        if (!activeTab) {
            setLoading(false);
            setError("No active tab");
            return;
        }

        const response = await chrome.tabs.sendMessage(activeTab.id, {type: "summarize"});

        if (!response) {
            setError("We messed up! Please try again.");
        } else if (response.error) {
            navigate("/error");
        } else {
            setError("");
        }

        setLoading(false);
    }


    return <div className="popup">
        <Header/>
        <div className="app__container">
            <div className="row row-center">
                <input
                    className="input-field"
                    value={search}
                    placeholder="Search with Ghost Reader..."
                    type="text"
                    onChange={(e) => setSearch(e.target.value)}
                />
                {loading ? <Loading/> : <button className="button" onClick={handleSearch}>🔍</button>}
            </div>
            <div className="inline-error">{error}</div>
            <div className="row separator">
                <hr className="divider"/>
                <span>or</span>
                <hr className="divider"/>
            </div>
            <div className="row row-center">
                {loading ? <Loading/> : <button className="button" onClick={handleSummarize}>Summarize</button>}
            </div>
        </div>
    </div>
}

export default App