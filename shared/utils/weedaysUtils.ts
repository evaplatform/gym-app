import { store } from "@/redux";
import { WeekDaysEnum } from "../enum/WeekDaysEnum";

export type WeekDayDescription = {
    day: WeekDaysEnum;
    description: string;
    shortDescription: string;
}

const getDaysOfCurrentWeek = (date: Date = new Date()): Date[] => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Set to Sunday
    const daysOfWeek = [];

    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        daysOfWeek.push(day);
    }

    return daysOfWeek;
}

const getWeekdaysList = (): WeekDayDescription[] => {
    return Object.values(WeekDaysEnum)
        .filter((v) => typeof v === "number") // avoid duplicate values
        .map((dayNumber) => ({
            day: dayNumber as WeekDaysEnum,
            description: getDescriptionForWeekDay(dayNumber, "long"),
            shortDescription: getDescriptionForWeekDay(dayNumber, "short"),
        }));
};


const getDescriptionForWeekDay = (
    dayNumber: WeekDaysEnum,
    format: "long" | "short" = "long"
) => {
    const state = store.getState();
    const locale = state.language.currentLanguage;

    // Ajusta o número para o formato do Date (0 = domingo)
    const dayIndex = (dayNumber - 1) % 7;

    // Data base fixa (domingo)
    const YEAR_MOCKED = 2025;
    const MONTH_MOCKED = 0; // janeiro
    const DAY_MOCKED = 5; // domingo
    const date = new Date(YEAR_MOCKED, MONTH_MOCKED, DAY_MOCKED + dayIndex);

    return new Intl.DateTimeFormat(locale, { weekday: format }).format(date);
}


export {
    getDaysOfCurrentWeek,
    getWeekdaysList,
};