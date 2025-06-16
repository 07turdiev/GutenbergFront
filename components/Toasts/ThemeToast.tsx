import {toasts} from "../../utils/toasts";
import React from "react";
import AddToMark from "./AddToMark";

const ThemeToast = (locale: string, langKey ) => {
    return (
        <div>
            {toasts[locale][langKey]}
        </div>
    );
};

export default ThemeToast;