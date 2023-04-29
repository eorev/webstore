import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/solid";
import "./Contact.css";

const ContactForm = () => {
    const [showForm, setShowForm] = useState<boolean>(false);
    const form = useRef<HTMLFormElement>(null);

    const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        emailjs
            .sendForm(
                "gmail",
                "contact-form",
                e.target as HTMLFormElement,
                "DVfhA7LjdkBV9ij4x"
            )
            .then(
                (result) => {
                    console.log(result.text);
                },
                (error) => {
                    console.log(error.text);
                }
            );
        e.currentTarget.reset();
    };

    return (
        <div className="contact-form">
            <button
                className="contact-button"
                onClick={() => {
                    setShowForm(!showForm);
                }}
            >
                <ChatBubbleLeftEllipsisIcon className="chat-icon" />
            </button>
            {showForm && (
                <div className="contact-form-container">
                    <form ref={form} onSubmit={sendEmail}>
                        <label>Name</label>
                        <input type="text" name="name" />
                        <label>Email</label>
                        <input type="email" name="email" />
                        <label>Subject</label>
                        <input type="subject" name="subject" />
                        <label>Message</label>
                        <textarea name="message" />
                        <input type="submit" value="Send" />
                    </form>
                </div>
            )}
        </div>
    );
};

export default ContactForm;
