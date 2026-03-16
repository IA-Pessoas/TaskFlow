import { useTheme } from "../contexts/ThemeContext";

function ThemeToggle(){
    const {theme, toggleTheme} = useTheme();

    return(
            <button onClick={toggleTheme}>
                Mudar tema ({ theme })
            </button>
    );
}

export default ThemeToggle;