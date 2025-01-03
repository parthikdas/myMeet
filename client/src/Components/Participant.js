import React, { memo } from "react";
// Memoized Participant Component for Optimal Rendering
const Participant = memo(({ username }) => {
    // Ensure username is a valid string, default to 'Unknown' if not
    const validUsername = username || "Unknown";
    // Valid Username: I added a fallback for username using const validUsername = username || "Unknown";. If username is null or undefined, it will default to "Unknown".
    // Accessing username[0]: Since validUsername is always a string, validUsername[0] will no longer throw the error.

    const randomColor = React.useMemo(
        () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`,
        []
    );

    return (
        <div className="users">
            <div id="username">{validUsername}</div>
            <p style={{ backgroundColor: randomColor }}>
                {validUsername[0].toUpperCase()}
            </p>
        </div>
    );
});
export default Participant;
