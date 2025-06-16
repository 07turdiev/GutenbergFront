import React from 'react';

const UserItem = ({item, handleClick}) => {
    return (
        <div>
            {item.name}
            <div>
                <button onClick={handleClick}>Render</button>
            </div>
        </div>
    );
};

export default React.memo(UserItem);
