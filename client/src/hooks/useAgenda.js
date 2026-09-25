import { useCallback, useMemo, useState } from "react";
import useAuth from "./useAuth.js";
import useAsyncData from "./useAsyncData.js";
import useConfirmation from "./useConfirmation.js";
import { createSchedule, deleteSchedule, getSchedules, updateSchedule } from "../services/schedule.service.js";
import { buildFairDays } from "../lib/fairs.js";
import { EMPTY_SCHEDULE, scheduleForDate, scheduleToFormValues } from "../lib/scheduleForm.js";
import { ROLES } from "../lib/constants.js";
import { formatDate } from "../lib/formatters.js";

const HISTORY_MONTHS = 2;

// Sin "from" el backend solo devuelve horarios que no terminaron: se piden también los de los últimos meses
const loadAgendaSchedules = async () => {
    const from = new Date();
    from.setMonth(from.getMonth() - HISTORY_MONTHS, 1);
    from.setHours(0, 0, 0, 0);
    const { schedules } = await getSchedules({ from: from.toISOString() });
    return schedules;
};

const isPastDay = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
};

// Agenda de ferias: todos ven los horarios; el emprendedor además carga, edita y borra los suyos
// (solo en ferias de su perfil, regla que también valida el backend)
function useAgenda() {
    const { role, entrepreneurProfile } = useAuth();
    const { data, status, error, reload, setData } = useAsyncData(loadAgendaSchedules);
    // Abrir y cerrar se separan del contenido: al cerrar, el modal conserva lo que mostraba durante su animación de salida
    const [fairDayView, setFairDayView] = useState({ id: null, isOpen: false });
    const [emptyDateMessage, setEmptyDateMessage] = useState(null);
    const [scheduleEditor, setScheduleEditor] = useState({ scheduleId: null, initialValues: EMPTY_SCHEDULE, isOpen: false, version: 0 });

    const ownFairs = entrepreneurProfile?.fairs ?? [];
    const canManageSchedules = role === ROLES.entrepreneur && Boolean(entrepreneurProfile);
    const fairDays = useMemo(() => buildFairDays(data ?? []), [data]);

    const openFairDay = useCallback((fairDayId) => {
        setEmptyDateMessage(null);
        setFairDayView({ id: fairDayId, isOpen: true });
    }, []);

    const closeFairDay = useCallback(() => setFairDayView((previous) => ({ ...previous, isOpen: false })), []);

    // Cada apertura del editor incrementa "version": el formulario se vuelve a crear con los valores nuevos
    const openScheduleEditor = useCallback((scheduleId, initialValues) => {
        setFairDayView((previous) => ({ ...previous, isOpen: false }));
        setScheduleEditor((previous) => ({ scheduleId, initialValues, isOpen: true, version: previous.version + 1 }));
    }, []);

    const openNewSchedule = useCallback((initialValues) => openScheduleEditor(null, initialValues), [openScheduleEditor]);

    const openScheduleEdit = useCallback((schedule) => openScheduleEditor(schedule.id, scheduleToFormValues(schedule)), [openScheduleEditor]);

    const closeScheduleEditor = useCallback(() => setScheduleEditor((previous) => ({ ...previous, isOpen: false })), []);

    // Fecha sin ferias: el emprendedor puede cargar un horario ese día; el resto recibe una explicación
    const selectEmptyDate = useCallback((date) => {
        const day = formatDate(date);
        if (!canManageSchedules) {
            setEmptyDateMessage(`No hay ferias con emprendedores confirmados el ${day}.`);
        } else if (isPastDay(date)) {
            setEmptyDateMessage(`El ${day} ya pasó: solo podés cargar horarios en fechas próximas.`);
        } else if (ownFairs.length === 0) {
            setEmptyDateMessage("Para cargar horarios, primero agregá desde tu perfil al menos una feria a la que asistís.");
        } else {
            setEmptyDateMessage(null);
            openNewSchedule(scheduleForDate(date));
        }
    }, [canManageSchedules, ownFairs.length, openNewSchedule]);

    // El backend devuelve el horario sin la feria ni el emprendedor: se recarga la agenda para mostrarlo completo
    const saveSchedule = useCallback(async (payload) => {
        if (scheduleEditor.scheduleId) {
            await updateSchedule(scheduleEditor.scheduleId, payload);
        } else {
            await createSchedule(payload);
        }
        closeScheduleEditor();
        reload();
    }, [scheduleEditor.scheduleId, closeScheduleEditor, reload]);

    const scheduleRemoval = useConfirmation(useCallback(async (schedule) => {
        await deleteSchedule(schedule.id);
        setData((previous) => previous.filter((existing) => existing.id !== schedule.id));
    }, [setData]));
    const { open: openScheduleRemoval } = scheduleRemoval;

    // Bootstrap no apila modales: se cierra el detalle de la jornada antes de pedir la confirmación
    const askScheduleRemoval = useCallback((schedule) => {
        closeFairDay();
        openScheduleRemoval(schedule);
    }, [closeFairDay, openScheduleRemoval]);

    return {
        fairDays,
        status,
        error,
        reload,
        role,
        ownProfileId: entrepreneurProfile?.id ?? null,
        ownFairs,
        canManageSchedules,
        selectedFairDay: fairDays.find((fairDay) => fairDay.id === fairDayView.id) ?? null,
        isFairDayOpen: fairDayView.isOpen,
        openFairDay,
        closeFairDay,
        emptyDateMessage,
        selectEmptyDate,
        scheduleEditor,
        openNewSchedule,
        openScheduleEdit,
        closeScheduleEditor,
        saveSchedule,
        scheduleRemoval,
        askScheduleRemoval
    };
}

export default useAgenda;
