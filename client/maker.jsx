const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

const handleEntry = (e, onEntryAdded) => {
    e.preventDefault();
    helper.hideError();

    const acronym = e.target.querySelector('#acronym').value;
    const definition = e.target.querySelector('#definition').value;
    const tags = e.target.querySelector('#tags').value;
    const blacklist = e.target.querySelector('#blacklist').checked;
    const creator = e.target.querySelector('#creator').value;

    if(!acronym || !definition || !creator) {
        helper.handleError('Acronym, definition, and creator are required!');
        return false;
    }

    helper.sendPost(e.target.action, {acronym, definition, tags, blacklist, creator}, onEntryAdded);
    return false;
};

const EntryForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={(e) => handleEntry(e, props.triggerReload)}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="acronym">Acronym: </label>
            <input id="acronym" type="text" name="acronym" placeholder="Acronym"/>
            <label htmlFor="definition">Definition: </label>
            <input id="definition" type="text" name="definition" placeholder="Definition"/>
            <label htmlFor="tags">Tags: </label>
            <input id="tags" type="text" name="tags" placeholder="Tags"/>
            <label htmlFor="creator">Creator: </label>
            <input id="creator" type="text" name="creator" placeholder="Creator"/>
            <label htmlFor="blacklist">Blacklist? </label>
            <input id="blacklist" type="checkbox" name="blacklist"/>
            <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
        </form>
    );
};

const EntryList = (props) => {
    const [entries, setEntries] = useState(props.entries);

    useEffect(() => {
        const loadEntriesFromServer = async () => {
            const response = await fetch('/getEntries');
            const data = await response.json();
            setEntries(data.entries);
        };
        loadEntriesFromServer();
    }, [props.reloadEntries]);

    if(entries.length === 0) {
        return(
            <div className="entryList">
                <h3 className="emptyEntry">No Entries Yet!</h3>
            </div>
        );
    }

    const entryNodes = entries.map((entry) => {
        return (
            <div key={entry.id} className="entry">
                <h3 className="entryAcronym">Acronym: {entry.acronym}</h3>
                <h3 className="entryDefinition">Definition: {entry.definition}</h3>
                <h3 className="entryTags">Tags: {entry.tags}</h3>
                <h3 className="entryCreator">Creator: {entry.creator}</h3>
                <h3 className="entryBlacklist">Blacklisted: {entry.blacklist? 'Yes' : 'No'}</h3>
            </div>
        );
    });

    return (
        <div className="entryList">
            {entryNodes}
        </div>
    );
};

const App = () => {
    const [reloadEntries, setReloadEntries] = useState(false);

    return (
        <div>
            <div id="makeEntry">
                <EntryForm triggerReload={() => setReloadEntries(!reloadEntries)}/>
            </div>
            <div id="entries">
                <EntryList entries={[]} reloadEntries={reloadEntries}/>
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;