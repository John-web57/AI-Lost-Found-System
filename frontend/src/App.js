import React from "react";
import UploadItem from "./components/UploadItem";
import ItemList from "./components/ItemList";
import MatchFinder from "./components/MatchFinder";

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Lost & Found System</h1>
        <p>Report an item, upload a photo, and browse the community board.</p>
      </header>
      <main>
        <UploadItem />
        <ItemList />
        <MatchFinder />
      </main>
    </div>
  );
}

export default App;
