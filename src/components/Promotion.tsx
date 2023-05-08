import React, { useState } from "react";
import styles from "./Promotion.module.css";

interface PromotionProps {
    open: boolean;
    onClose: () => void;
}

const Promotion = ({ open, onClose }: PromotionProps) => {
    const [clickedYes, setClickedYes] = useState<boolean>(false);
    const [showCopied, setShowCopied] = useState<boolean>(false);
    const handleClickedYes = () => {
        setClickedYes(true);
    };
    const promoCode = "first50off";

    const handleCopy = () => {
        setShowCopied(true);
        navigator.clipboard.writeText(promoCode);
    };

    if (!open) return null;
    return (
        <div className={styles.promotionStyle}>
            <div onClick={onClose} className={styles.overlay}>
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    className={styles.promotionContainer}
                >
                    <div className={styles.promotionRight}>
                        <p className={styles.closeBtn} onClick={onClose}>
                            X
                        </p>
                        <div className={styles.content}>
                            <h2>Welcome to Nestled!</h2>
                            <p>Do you want</p>
                            <h1>$50 off of $150+</h1>
                            <p>on your first order?</p>
                        </div>
                        {!clickedYes && (
                            <div className={styles.btnContainer}>
                                <button
                                    className={styles.btnPrimary}
                                    onClick={handleClickedYes}
                                >
                                    <span className={styles.bold}>YES</span>
                                </button>
                                <button
                                    className={styles.btnOutline}
                                    onClick={onClose}
                                >
                                    <span className={styles.bold}>NO</span>,
                                    thanks
                                </button>
                            </div>
                        )}
                        {clickedYes && (
                            <div>
                                <input
                                    type="text"
                                    value={promoCode}
                                    style={{
                                        border: "1px solid black",
                                        marginBottom: "20px",
                                        marginLeft: "200px"
                                    }}
                                    readOnly
                                />
                                <button onClick={handleCopy}>Copy</button>
                                {showCopied && (
                                    <span
                                        style={{
                                            marginLeft: "5px",
                                            color: "green"
                                        }}
                                    >
                                        Copied!
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Promotion;
