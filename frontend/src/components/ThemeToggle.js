import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
function getInitial() {
    if (typeof window === "undefined")
        return "light";
    const saved = localStorage.getItem("theme");
    if (saved)
        return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
export function ThemeToggle() {
    const [theme, setTheme] = useState(getInitial);
    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);
    return (_jsx("button", { type: "button", "aria-label": "Toggle theme", onClick: () => setTheme(theme === "dark" ? "light" : "dark"), className: "rounded-full p-2 border border-brand-gold/40 bg-brand-gold/10 hover:bg-brand-gold/20 transition text-brand-gold-dark dark:text-brand-gold", children: theme === "dark" ? (_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("circle", { cx: "12", cy: "12", r: "4" }), _jsx("path", { d: "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" })] })) : (_jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" }) })) }));
}
