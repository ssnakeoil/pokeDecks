import React, { useState, useEffect } from 'react';

import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';

import Auth from '../utils/auth';

const SignupForm = () => {
    const [formState, setFormState] = useState({ username: '', email: '', password: '' });
    const [addUser, { error, data }] = useMutation(ADD_USER);

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        console.log(formState);

        try {
            const { data } = await addUser({
                variables: { ...formState },
            });

            Auth.login(data.addUser.token);
        } catch (e) {
            console.error(e);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormState({
            ...formState,
            [name]: value,
        });
    };

    return (
        <main>
            <div>
                Sign Up
            </div>

            <div>
                <div>
                    <form onSubmit={handleFormSubmit}>
                        <input
                            placeholder="Your username"
                            name="username"
                            type="username"
                            value={formState.username}
                            onChange={handleChange}
                        />
                        <input
                            placeholder="Your email"
                            name="email"
                            type="email"
                            value={formState.email}
                            onChange={handleChange}
                        />
                        <input
                            placeholder="******"
                            name="password"
                            type="password"
                            value={formState.password}
                            onChange={handleChange}
                        />
                        <button
                            type="submit"
                        >
                            Submit
                        </button>
                    </form>

                    {error && (
                        <div className="my-3 p-3 bg-danger text-white">
                            {error.message}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};