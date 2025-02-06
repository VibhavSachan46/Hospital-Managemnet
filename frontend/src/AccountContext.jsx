import { createContext, useContext, useState, useEffect } from "react";

const AccountContext = createContext();

export const useAccount = () => useContext(AccountContext);

export const AccountProvider = ({ children }) => {
    const [account, setAccount] = useState(localStorage.getItem("Medicalaccount") || "");
    const [contract, setContract] = useState(null);

    useEffect(() => {
        console.log("Account updated:", account);
        if (account) {
            localStorage.setItem("Medicalaccount", account);
        } else {
            localStorage.removeItem("Medicalaccount");
        }
    }, [account]);

    return (
        <AccountContext.Provider value={{ account, setAccount, contract, setContract }}>
            {children}
        </AccountContext.Provider>
    );
};
