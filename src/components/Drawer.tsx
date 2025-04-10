import React, { useState } from 'react';

const Drawer: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <button
                onClick={toggleDrawer}
                className="drawer-toggle-button"
            >
                Open Drawer
            </button>
            {isOpen && (
                <>
                    <div
                        className="drawer-overlay"
                        onClick={toggleDrawer}
                    ></div>
                    <div className="drawer">
                        <button
                            onClick={toggleDrawer}
                            className="close-button"
                        >
                            Close
                        </button>
                        <div className="drawer-content">
                            <h2>Drawer Content</h2>
                            <p>This is the content inside the drawer.</p>
                        </div>
                    </div>
                </>
            )}
            <style jsx>{`
                .drawer-toggle-button {
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .drawer-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 999;
                }

                .drawer {
                    position: fixed;
                    top: 0;
                    right: 0;
                    width: 300px;
                    height: 100%;
                    background: white;
                    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
                    z-index: 1000;
                    display: flex;
                    flex-direction: column;
                    padding: 20px;
                }

                .close-button {
                    align-self: flex-end;
                    padding: 5px 10px;
                    background-color: #dc3545;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .drawer-content {
                    margin-top: 20px;
                }
            `}</style>
        </div>
    );
};

export default Drawer;