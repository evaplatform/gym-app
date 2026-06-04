// src/i18n/translations/pt.ts
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";

export const ptBrAppMessages: Record<AppMessagesEnum, string> = {
  //#region General Messages
  [AppMessagesEnum.LANGUAGE_SELECTOR_LABEL]: "Selecionar Idioma",
  [AppMessagesEnum.SUCCESS]: "Sucesso",
  [AppMessagesEnum.ERROR]: "Erro",
  [AppMessagesEnum.LOADING]: "Carregando...",
  [AppMessagesEnum.CANCEL]: "Cancelar",
  [AppMessagesEnum.CLOSE]: "Fechar",
  [AppMessagesEnum.REMOVE]: "Remover",
  [AppMessagesEnum.NO_DATA]: "Nenhum dado disponível.",
  [AppMessagesEnum.INVALID_DATA]: "Dados inválidos fornecidos.",
  [AppMessagesEnum.CONFIRMATION]: "Confirmação",
  [AppMessagesEnum.UNKNOWN]: "Erro desconhecido. Tente novamente.",
  [AppMessagesEnum.UPLOAD_IMAGE]: "Carregar Imagem",
  [AppMessagesEnum.UPLOAD_VIDEO]: "Carregar Vídeo",
  [AppMessagesEnum.UPDATE_VIDEO]: "Atualizar Vídeo",
  [AppMessagesEnum.SAVE]: "Salvar",
  [AppMessagesEnum.DESCRIPTION]: "Descrição",
  [AppMessagesEnum.LOCALIZATION]: "Localização",
  [AppMessagesEnum.PHONE]: "Telefone",
  [AppMessagesEnum.VIDEO_TOO_LONG]:
    "O vídeo selecionado é muito grande. Por favor, escolha um vídeo de até 1 minuto.",
  [AppMessagesEnum.LOCAL_DATA_BASE_UNAVAILABLE]:
    "Serviço de banco de dados local não está disponível.",
  [AppMessagesEnum.SESSION_EXPIRED]:
    "Sessão expirada. Por favor, faça login novamente.",
  [AppMessagesEnum.GATEWAY_TIMEOUT]: "Erro de conexão. Tente novamente.",
  [AppMessagesEnum.USER_ADMINISTRATOR]: "Usuário Administrador",
  [AppMessagesEnum.FINALIZE]: "Finalizar",
  [AppMessagesEnum.FINISHED]: "Finalizada",
  [AppMessagesEnum.SEARCH]: "Pesquisar",
  [AppMessagesEnum.NOT_DEFINED]: "Não Definido",
  [AppMessagesEnum.RESET]: "Reiniciar",
  [AppMessagesEnum.OF]: "de",
  [AppMessagesEnum.UNIT]: "unidade",
  [AppMessagesEnum.CONFIRM_TITLE]: "Confirmar",
  [AppMessagesEnum.CONFIRM_TEXT]: "Tem certeza que deseja prosseguir?",
  [AppMessagesEnum.INTERNET_CONNECTION_ERROR]:
    "Erro de conexão com a internet. Por favor, verifique sua conexão e tente novamente.",
      [AppMessagesEnum.FIREBASE_DELETE_ERROR]: "Erro ao deletar arquivo do Firebase.",
  [AppMessagesEnum.UPDATE]: "Atualizar",
  [AppMessagesEnum.ADD]: "Adicionar",
  [AppMessagesEnum.DELETE]: "Remover",
  [AppMessagesEnum.VISUALIZE]: "Visualizar", 
  [AppMessagesEnum.EDIT]: "Editar",
  // #endregion General Messages

  // #region Firebase
  [AppMessagesEnum.FIREBASE_BIG_FILE]:
    "Arquivo muito grande: {{size}}MB. Máximo permitido: {{maxSizeInMB}}MB",
  // #endregion Firebase

  // #region Login/Logout Messages
  [AppMessagesEnum.LOGIN_ACCESS_BUTTON]: "Acessar com Google",
  [AppMessagesEnum.LOGIN_SUCCESS]: "Login realizado com sucesso.",
  [AppMessagesEnum.LOGIN_SUCCESS_MESSAGE]: "Você fez login com sucesso.",
  [AppMessagesEnum.LOGIN_ERROR]:
    "Falha no login. Por favor, verifique suas credenciais e tente novamente.",
  [AppMessagesEnum.LOGOUT_SUCCESS]: "Logout realizado com sucesso.",
  [AppMessagesEnum.LOGOUT_ERROR]: "Falha no logout.",
  [AppMessagesEnum.LOGOUT_ERROR_MESSAGE]:
    "Ocorreu um erro durante o logout. Por favor, tente novamente mais tarde.",
  // #endregion Login/Logout Messages

  // #region Exercise Messages
  [AppMessagesEnum.EXERCISE_NOT_FOUND]: "Exercício não encontrado.",
  [AppMessagesEnum.EXERCISE_REMOVED_SUCCESS]: "Exercício removido com sucesso.",
  [AppMessagesEnum.EXERCISE_MOBILITY_FIELDS]:
    "Campos de mobilidade do exercício",
  [AppMessagesEnum.EXERCISE_GENERAL_FIELDS]: "Campos gerais do exercício",
  [AppMessagesEnum.EXERCISE_IMAGE_AND_VIDEO_FIELDS]: "Imagem e vídeo",
  [AppMessagesEnum.EXERCISE_HYPERTROPHY_FIELDS]:
    "Campos de hipertrofia do exercício",
  [AppMessagesEnum.REMOVE_EXERCISE_CONFIRMATION]:
    "Tem certeza que deseja remover este exercício?",
  [AppMessagesEnum.EXERCISE_NAME_LABEL]: "Nome do exercício",
  [AppMessagesEnum.EXERCISE_ADDED_SUCCESS]: "Exercício adicionado com sucesso.",
  [AppMessagesEnum.EXERCISE_EDITED_SUCCESS]: "Exercício editado com sucesso.",
  [AppMessagesEnum.EXERCISE_ADD_BUTTON]: "Adicionar Exercício",
  [AppMessagesEnum.EXERCISE_LIST]: "Lista de Exercícios",
  [AppMessagesEnum.EXERCISE_UPDATE]: "Atualizar Exercício",
  [AppMessagesEnum.EXERCISE_SELECT_PLACEHOLDER]: "Selecione um exercício",
  [AppMessagesEnum.EXERCISE_REMOVE]: "Remover Exercício",
  [AppMessagesEnum.EXERCISE_CREATED_SUCCESS]: "Exercício criado com sucesso.",
  [AppMessagesEnum.EXERCISE_ADD]: "Adicionar Exercício",
  [AppMessagesEnum.EXERCISE_EDIT]: "Editar Exercício",
  [AppMessagesEnum.EXERCISE_SCREEN_TITLE]: "Detalhes do Exercício",
  [AppMessagesEnum.EXERCISE_SCREEN_SET_WEIGHT]: "Deseja alterar o peso?",
  [AppMessagesEnum.EXERCISE_SCREEN_INITIAL_GPS_BUTTON]:
    "Iniciar Rastreamento GPS",
  [AppMessagesEnum.EXERCISE_HAS_STOPWATCH]: "Inclui Cronômetro?",
  [AppMessagesEnum.EXERCISE_HAS_GPS]: "Inclui Rastreamento GPS?",
  [AppMessagesEnum.EXERCISE_SCREEN_FINALIZE_EXERCISE_BUTTON]:
    "Finalizar Exercício",
  [AppMessagesEnum.EXERCISE_SCREEN_NO_HISTORY]:
    "Nenhum histórico de exercícios disponível.",
  [AppMessagesEnum.USER_EXERCISE_PACE_AVERAGE_LABEL]: "Média de Ritmo",
  [AppMessagesEnum.EXERCISE_SCREEN_TIME]: "Tempo",
  [AppMessagesEnum.EXERCISE_SCREEN_FINALIZE_EXERCISE_CONFIRMATION]:
    "Tem certeza que deseja finalizar este exercício?",
  // #endregion Exercise Messages

  //#region User Messages
  [AppMessagesEnum.USER_ID_NOT_FOUND]: "ID do Usuário não encontrado.",
  [AppMessagesEnum.USER_NAME_LABEL]: "Nome do usuário",
  [AppMessagesEnum.USER_EMAIL_LABEL]: "Email do usuário",
  [AppMessagesEnum.USER_PHONE_LABEL]: "Telefone do usuário",
  [AppMessagesEnum.USER_CREATED_SUCCESS]: "Usuário criado com sucesso.",
  [AppMessagesEnum.USER_EDITED_SUCCESS]: "Usuário editado com sucesso.",
  [AppMessagesEnum.USER_REMOVED_SUCCESS]: "Usuário removido com sucesso.",
  [AppMessagesEnum.USER_LIST]: "Lista de Usuários",
  [AppMessagesEnum.USER_ADD_BUTTON]: "Adicionar Usuário",
  [AppMessagesEnum.USER_UPDATE]: "Atualizar Usuário",
  [AppMessagesEnum.USER_SELECT_PLACEHOLDER]: "Selecione um usuário",
  [AppMessagesEnum.USER_REMOVE]: "Remover Usuário",
  [AppMessagesEnum.USER_REMOVE_CONFIRMATION]:
    "Tem certeza que deseja remover este usuário?",
  [AppMessagesEnum.USER_NOT_FOUND]: "Usuário não encontrado.",
  [AppMessagesEnum.USER_ADD]: "Adicionar Usuário",
  [AppMessagesEnum.USER_EDIT]: "Editar Usuário",
  // #endregion User Messages

  // #region ExerciseByUser Messages
  [AppMessagesEnum.NO_EXERCISE_FOR_USER]:
    "Nenhum exercício encontrado para o usuário.",
  [AppMessagesEnum.EXERCISE_ID_NOT_FOUND]: "ID do Exercício não encontrado.",
  [AppMessagesEnum.USER_EXERCISE_NOT_FOUND]:
    "Exercício do usuário não encontrado.",
  [AppMessagesEnum.USER_EXERCISE_REMOVED_SUCCESS]:
    "Exercício removido do usuário com sucesso.",
  [AppMessagesEnum.USER_EXERCISE_REMOVE_CONFIRMATION]:
    "Tem certeza que deseja remover este exercício do usuário?",
  [AppMessagesEnum.USER_EXERCISE_EDITED_SUCCESS]:
    "Exercício do usuário editado com sucesso.",
  [AppMessagesEnum.USER_EDIT_TRAINING_TO_USER_BUTTON]:
    "Editar treino ao usuário",
  [AppMessagesEnum.USER_ADD_TRAINING_TO_USER_BUTTON]:
    "Adicionar treino ao usuário",
  [AppMessagesEnum.TRAINING_BY_USER_UPDATED_SUCCESS]:
    "Treino atualizado ao usuário com sucesso.",
  [AppMessagesEnum.TRAINING_BY_USER_ADDED_SUCCESS]:
    "Treino adicionado ao usuário com sucesso.",
  [AppMessagesEnum.USER_EXERCISE_LIST]: "Lista de Exercícios do Usuário",
  [AppMessagesEnum.USER_EXERCISE_UPDATE]: "Atualizar Exercício do Usuário",
  [AppMessagesEnum.USER_EXERCISE_DISTANCE_LABEL]: "Distância",
  [AppMessagesEnum.USER_EXERCISE_DISTANCE_UNIT_LABEL]: "Unidade de Distância",
  [AppMessagesEnum.USER_EXERCISE_DURATION_LABEL]: "Duração",
  [AppMessagesEnum.USER_EXERCISE_WEIGHT_LABEL]: "Peso (kg)",
  [AppMessagesEnum.USER_EXERCISE_WEIGHT]: "Peso",
  [AppMessagesEnum.USER_EXERCISE_SETS_LABEL]: "Séries",
  [AppMessagesEnum.USER_EXERCISE_SHORT_DESCRIPTION_LABEL]:
    "descrição do exercício",
  [AppMessagesEnum.USER_EXERCISE_GOAL_LABEL]: "Objetivo",
  [AppMessagesEnum.USER_EXERCISE_REPETITIONS_LABEL]: "Repetições",
  [AppMessagesEnum.USER_EXERCISE_REST_TIME_BETWEEN_SETS_LABEL]:
    "Tempo de Descanso Entre Séries (em segundos)",
  [AppMessagesEnum.EXERCISE_REST_TIME_BETWEEN_SETS]:
    "Tempo de Descanso Entre Séries",
  [AppMessagesEnum.USER_EXERCISE_FINISH_TRAIN]: "Finalizar treino",
  [AppMessagesEnum.USER_EXERCISE_HAS_NOTES_LABEL]:
    "Inclui Anotações do Usuário?",
  [AppMessagesEnum.TRAINING_BY_USER_CONFIRM_SAVE]:
    "Tem certeza que deseja salvar as alterações nos treinos do usuário?",
  [AppMessagesEnum.TRAINING_BY_USER_CONFIRM_SAVE_TITLE]: "Confirmar Alterações",
  [AppMessagesEnum.TRAINING_BY_USER_NOT_FOUND]:
    "Treino do usuário não encontrado.",
  [AppMessagesEnum.USER_EXERCISE_ALL_TRAININGS_COMPLETED]:
    "Todos os treinos para este exercício do usuário foram concluídos.",
  [AppMessagesEnum.USER_EXERCISE_TRAINING_COMPLETED]:
    "Treino concluído com sucesso para este exercício.",
  // #endregion ExerciseByUser Messages

  // #region Academy Messages
  [AppMessagesEnum.ACADEMY_ID_NOT_FOUND]: "ID da Academia não encontrado.",
  [AppMessagesEnum.ACADEMY_NAME_LABEL]: "Nome da academia",
  [AppMessagesEnum.ACADEMY_NOT_FOUND]: "Academia não encontrada.",
  [AppMessagesEnum.ACADEMY_REMOVED_SUCCESS]: "Academia removida com sucesso.",
  [AppMessagesEnum.ACADEMY_REMOVE_CONFIRMATION]:
    "Tem certeza que deseja remover esta academia?",
  [AppMessagesEnum.ACADEMY_EXERCISE_LIST]: "Lista de Exercícios da Academia",
  [AppMessagesEnum.ACADEMY_LIST]: "Lista de Academias",
  [AppMessagesEnum.ACADEMY_NOT_FOUND_FOR_USER]:
    "Nenhuma academia encontrada para o usuário.",
  [AppMessagesEnum.ACADEMY_CREATED_SUCCESS]: "Academia criada com sucesso.",
  [AppMessagesEnum.ACADEMY_EDITED_SUCCESS]: "Academia editada com sucesso.",
  [AppMessagesEnum.ACADEMY_USER_LIMIT]:
    "Limite de usuários para esta academia.",
  [AppMessagesEnum.ACADEMY_REMOVE]: "Remover Academia",
  [AppMessagesEnum.ACADEMY_ADD]: "Adicionar Academia",
  [AppMessagesEnum.ACADEMY_EDIT]: "Editar Academia",
  // #endregion Academy Messages

  //#region Training Messages
  [AppMessagesEnum.TRAINING_ID_NOT_FOUND]: "IDs dos treinos não encontrado.",
  [AppMessagesEnum.TRAINING_EXERCISE_LIST]: "Lista de Exercícios do treinos",
  [AppMessagesEnum.NO_TRAINING_FOR_USER]:
    "Nenhum treino encontrado para o usuário.",
  [AppMessagesEnum.TRAINING_NAME_LABEL]: "Lista de treinos",
  [AppMessagesEnum.TRAINING_NOT_FOUND]: "Treinos não encontrado.",
  [AppMessagesEnum.TRAINING_REMOVED_SUCCESS]: "Treinos removido com sucesso.",
  [AppMessagesEnum.REMOVE_TRAINING_CONFIRMATION]:
    "Tem certeza que deseja remover este treinos?",
  [AppMessagesEnum.TRAINING_ADDED_SUCCESS]: "Treinos adicionado com sucesso.",
  [AppMessagesEnum.TRAINING_EDITED_SUCCESS]: "Treinos editado com sucesso.",
  [AppMessagesEnum.TRAINING_ADD_BUTTON]: "Adicionar treinos",
  [AppMessagesEnum.TRAINING_UPDATE]: "Atualizar treinos",
  [AppMessagesEnum.TRAINING_LIST]: "Lista de treinos",
  [AppMessagesEnum.TRAINING_SELECT_PLACEHOLDER]: "Selecione um treinos",
  [AppMessagesEnum.TRAINING_REMOVE]: "Remover treinos",
  [AppMessagesEnum.TRAINING_CREATED_SUCCESS]: "Treinos criado com sucesso.",
  [AppMessagesEnum.TRAINING_REMOVE_CONFIRMATION]:
    "Tem certeza que deseja remover este treinos?",
  [AppMessagesEnum.TRAINING_TYPE_LABEL]: "Tipo de treinos",
  // #endregion Training Messages

  // #region Tabs
  [AppMessagesEnum.TAB_REPORTS]: "Relatórios",
  [AppMessagesEnum.TAB_CHARTS]: "Gráficos",
  [AppMessagesEnum.TAB_CARDIO]: "Cardio",
  [AppMessagesEnum.TAB_HOME]: "Início",
  [AppMessagesEnum.TAB_EXERCISES]: "Exercícios",
  [AppMessagesEnum.TAB_FINANCIAL]: "Financeiro",
  [AppMessagesEnum.TAB_CALENDAR]: "Calendário",
  // #endregion Tabs

  // #region Exercise Screen
  [AppMessagesEnum.EXERCISE_SCREEN_HISTORY_TAB]: "Histórico",
  [AppMessagesEnum.EXERCISE_SCREEN_DESCRIPTION_TAB]: "Descrição",
  [AppMessagesEnum.EXERCISE_SCREEN_EXERCISE_DETAILS_TAB]: "Exercício",
  [AppMessagesEnum.EXERCISE_SCREEN_SERIES]: "Séries",
  [AppMessagesEnum.EXERCISE_SCREEN_REPETITIONS]: "Repetições",
  [AppMessagesEnum.EXERCISE_SCREEN_GOAL]: "Objetivo",
  [AppMessagesEnum.EXERCISE_SCREEN_DURATION]: "Duração (em minutos)",
  [AppMessagesEnum.EXERCISE_SCREEN_DISTANCE]: "Distância",
  [AppMessagesEnum.EXERCISE_SCREEN_GPS_METRICS]: "Métricas de GPS",
  [AppMessagesEnum.EXERCISE_SCREEN_ELAPSED_TIME_LABEL]: "Tempo Decorrido",
  [AppMessagesEnum.EXERCISE_COMPLETED_SUCCESS_MESSAGE]:
    "Exercício concluído com sucesso.",
  [AppMessagesEnum.EXERCISE_SCREEN_SPEED_AVERAGE_LABEL]: "Velocidade Média",
  [AppMessagesEnum.EXERCISE_SCREEN_HEART_RATE_AVERAGE_LABEL]: "FC Média",
  [AppMessagesEnum.EXERCISE_SCREEN_SET]: "Série",
  [AppMessagesEnum.EXERCISE_SCREEN_FINALIZE_EXERCISES_CONFIRMATION]:
    "Tem certeza que deseja finalizar todos os exercícios?",
  [AppMessagesEnum.EXERCISE_SCREEN_FINALIZE_EXERCISES_BUTTON]:
    "Finalizar Exercícios",
  [AppMessagesEnum.FINISH_SET_WITHOUT_REST]: "Finalizar Série Sem Descanso",
  // #endregion Exercise Screen

  // #region Groups
  [AppMessagesEnum.DRAWER_NO_GROUPS_FOUND]: "Grupos não encontrados.",
  [AppMessagesEnum.DRAWER_ADD_GROUP_TITLE]: "Adicionar Grupo",
  [AppMessagesEnum.DRAWER_EDIT_GROUP_TITLE]: "Editar Grupo",
  [AppMessagesEnum.GROUP_NAME]: "Nome do Grupo",
  [AppMessagesEnum.GROUP_NAME_EXAMPLE]: "ex: admin",
  [AppMessagesEnum.GROUP_NOT_FOUND]: "Grupo não encontrado.",
  [AppMessagesEnum.GROUP_CREATED_SUCCESS]: "Grupo criado com sucesso.",
  [AppMessagesEnum.GROUP_UPDATED_SUCCESS]: "Grupo atualizado com sucesso.",
  [AppMessagesEnum.GROUP_REMOVED_SUCCESS]: "Grupo removido com sucesso.",
  [AppMessagesEnum.CONFIRM_REMOVE_GROUP_TITLE]: "Remover Grupo",
  [AppMessagesEnum.CONFIRM_REMOVE_GROUP_MESSAGE]:
    "Tem certeza que deseja remover este grupo?",
  [AppMessagesEnum.GROUP_LIST]: "Lista de Grupos",
  // #endregion Groups

  // #region charts
  [AppMessagesEnum.NO_HISTORY_DATA]: "Nenhum dado de histórico disponível.",
  [AppMessagesEnum.EXERCISE_SCREEN_HISTORY_CHART_TITLE]:
    "Gráficos de Histórico de Exercícios",
  [AppMessagesEnum.SHOW_CHART_VALUES]: "Mostrar Valores do Gráfico",
  [AppMessagesEnum.TRAININGS]: "Treinos",
  // #endregion charts

  // #region Stopwatch
  [AppMessagesEnum.STOPWATCH_TITLE]: "Cronômetro",
  [AppMessagesEnum.STOPWATCH_START]: "Iniciar",
  [AppMessagesEnum.STOPWATCH_PAUSE]: "Pausar",
  [AppMessagesEnum.STOPWATCH_RESET]: "Resetar",
  [AppMessagesEnum.STOPWATCH_REST]: "Descansar",
  // #endregion Stopwatch

  // #region Drawer Labels
  [AppMessagesEnum.DRAWER_HOME]: "Início",
  [AppMessagesEnum.DRAWER_USER_LIST]: "Lista de Usuários",
  [AppMessagesEnum.DRAWER_ACADEMY_LIST]: "Lista de Academias",
  [AppMessagesEnum.DRAWER_EXERCISE_LIST]: "Lista de Exercícios",
  [AppMessagesEnum.DRAWER_TRAINING_LIST]: "Lista de Treinos",
  [AppMessagesEnum.DRAWER_TRAININGS_BY_USER_LIST]:
    "Lista de treinos por usuário",
  [AppMessagesEnum.GROUPS_DRAWER]: "Grupos",
  [AppMessagesEnum.DRAWER_LOGOUT]: "Sair",
  [AppMessagesEnum.DRAWER_NO_USERS_FOUND]: "Nenhum usuário encontrado.",
  [AppMessagesEnum.DRAWER_NO_EXERCISES_FOUND]: "Nenhum exercício encontrado.",
  [AppMessagesEnum.DRAWER_NO_ACADEMIES_FOUND]: "Nenhuma academia encontrada.",
  [AppMessagesEnum.DRAWER_NO_TRAININGS_FOUND]: "Nenhum treinamento encontrado.",
  [AppMessagesEnum.DRAWER_ADD_EXERCISE_BUTTON_TITLE]: "Adicionar Exercício",
  [AppMessagesEnum.DRAWER_ADD_TRAINING_BUTTON_TITLE]: "Adicionar Treinamento",
  [AppMessagesEnum.DRAWER_ADD_USER_BUTTON_TITLE]: "Adicionar Usuário",
  [AppMessagesEnum.DRAWER_USER_SETTINGS]: "Configurações do Usuário",
  [AppMessagesEnum.CHARTS_DRAWER]: "Relatórios",
  // #endregion Drawer Labels
  // #region HistoryTab Labels
  [AppMessagesEnum.USER_EXERCISE_COMPLETED_AT_LABEL]: "Concluído em",
  [AppMessagesEnum.USER_EXERCISE_NOTES_LABEL]: "Minhas anotações",
  [AppMessagesEnum.USER_EXERCISE_COMPLETED_SETS_LABEL]: "Séries Concluídas",
  [AppMessagesEnum.USER_EXERCISE_COMPLETED_REPETITIONS_LABEL]:
    "Repetições Concluídas",
  [AppMessagesEnum.USER_EXERCISE_WEIGHT_USED_LABEL]: "Peso Utilizado (kg)",
  [AppMessagesEnum.USER_EXERCISE_PACE_LABEL]: "Ritmo",
  [AppMessagesEnum.USER_EXERCISE_AVG_HEART_RATE_LABEL]: "FC Média",
  [AppMessagesEnum.USER_EXERCISE_MAX_HEART_RATE_LABEL]: "FC Máxima",
  [AppMessagesEnum.USER_EXERCISE_START_LOCATION_LABEL]: "Local de Início",
  [AppMessagesEnum.USER_EXERCISE_END_LOCATION_LABEL]: "Local de Término",
  [AppMessagesEnum.USER_EXERCISE_ROUTE_POINTS_LABEL]: "Pontos da Rota",
  [AppMessagesEnum.USER_EXERCISE_POINTS_LABEL]: "pontos",
  [AppMessagesEnum.USER_EXERCISE_PERCEIVED_EFFORT_LABEL]: "Esforço Percebido",
  [AppMessagesEnum.USER_EXERCISE_FEELING_SCORE_LABEL]: "Esforço Sentido",
  [AppMessagesEnum.USER_EXERCISE_AVG_REPETITIONS_LABEL]: "Média de Repetições",
  [AppMessagesEnum.USER_EXERCISE_COMPLETED_LABEL]: "Concluído",
  [AppMessagesEnum.YES_LABEL]: "Sim",
  [AppMessagesEnum.NO_LABEL]: "Não",
  [AppMessagesEnum.USER_EXERCISE_PARTIALLY_COMPLETED_LABEL]:
    "Parcialmente Concluído",
  [AppMessagesEnum.USER_EXERCISE_USER_NOTES_LABEL]: "Notas do Usuário",
  // #endregion HistoryTab Labels

  // #region GPS SCREEN
  [AppMessagesEnum.GPS_ROUTE_HISTORY]: "Histórico de Rotas",
  [AppMessagesEnum.GPS_VIEW_ROUTE]: "Ver Rota",
  [AppMessagesEnum.GPS_SCREEN_TITLE]: "Rastreamento GPS",
  [AppMessagesEnum.GPS_SCREEN_START_TRACKING_BUTTON]: "Iniciar Rastreamento",
  [AppMessagesEnum.GPS_SCREEN_STOP_TRACKING_BUTTON]: "Parar Rastreamento",
  [AppMessagesEnum.GPS_SCREEN_TRACKING_IN_PROGRESS]:
    "Rastreamento em andamento...",
  [AppMessagesEnum.GPS_SCREEN_NO_LOCATION_PERMISSION]:
    "Permissão de Localização Negada",
  [AppMessagesEnum.GPS_SCREEN_LOCATION_PERMISSION_MESSAGE]:
    "Este aplicativo requer acesso à localização para rastrear a rota do seu exercício. Por favor, habilite as permissões de localização nas configurações do seu dispositivo.",
  [AppMessagesEnum.GPS_START]: "Iniciar",
  [AppMessagesEnum.GPS_STOP]: "Parar",
  [AppMessagesEnum.GPS_RACE]: "corrida",
  [AppMessagesEnum.GPS_FINALIZE]: "Finalizar",
  [AppMessagesEnum.GPS_CONFIRM_FINALIZE_RACE]:
    "Tem certeza de que deseja finalizar a corrida?",
  [AppMessagesEnum.GPS_CURRENT_SPEED_LABEL]: "Velocidade Atual",
  [AppMessagesEnum.GPS_SEARCH_DESTINATION_LABEL]: "Buscar destino",
  [AppMessagesEnum.GPS_COMPLETED]: "Rastreamento GPS concluído com sucesso.",
  [AppMessagesEnum.GPS_LOADING_ROUTE]: "Carregando rota, por favor aguarde...",
  [AppMessagesEnum.GPS_CLEAR_ROUTE]: "Limpar rota",
  [AppMessagesEnum.GPS_OFF_ROUTE_WARNING]: "Você está fora da rota planejada.",
  [AppMessagesEnum.GPS_RECALCULATE_ROUTE_BUTTON]: "Recalcular Rota",
  [AppMessagesEnum.GPS_REROUTING_IN_PROGRESS]:
    "Recalculando rota em andamento...",
  [AppMessagesEnum.CONFIRM_ERASE_GPS_DATA_TITLE]:
    "Confirmar Exclusão dos Dados de GPS",
  [AppMessagesEnum.CONFIRM_ERASE_GPS_DATA_MESSAGE]:
    "Ao iniciar um novo rastreamento GPS, os dados do rastreamento anterior serão apagados. Tem certeza de que deseja continuar?",
  // #endregion GPS SCREEN

  // #region SeriesBetweenSets
  [AppMessagesEnum.SERIES_BETWEEN_SETS_ALL_SERIES_COMPLETED]:
    "Todas as séries concluídas! ",
  // #endregion SeriesBetweenSets

  // #region Settings
  [AppMessagesEnum.SETTINGS_SCREEN_TITLE]: "Configurações",
  [AppMessagesEnum.SETTINGS_LANGUAGE_LABEL]: "Idioma",
  [AppMessagesEnum.SETTINGS_THEME_LABEL]: "Tema",
  [AppMessagesEnum.SETTINGS_RESET_DATA_BUTTON]: "Redefinir Todos os Dados",
  [AppMessagesEnum.SETTINGS_RESET_DATA_CONFIRMATION]:
    "Tem certeza de que deseja redefinir todos os dados? Esta ação não pode ser desfeita.",
  [AppMessagesEnum.SETTINGS_DATA_RESET_SUCCESS]:
    "Todos os dados foram redefinidos com sucesso.",
  // #endregion Settings

  // #region Permissions

  // Permissões de Grupo
    [AppMessagesEnum.PERMISSIONS]: "Permissões",
  [AppMessagesEnum.PERMISSION_CHANGE_ACADEMY]: "Alterar academia",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU]: "Menu lateral",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_HOME]: "Menu lateral - Início",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_HOME_TABS]:
    "Menu lateral - Início (Abas)",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_HOME_TABS_HOME]:
    "Menu lateral - Aba Início",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_HOME_TABS_CALENDAR]:
    "Menu lateral - Aba Calendário",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_HOME_TABS_EXERCISES]:
    "Menu lateral - Aba Exercícios",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_HOME_TABS_EXERCISES_FINALIZE_TRAINING_BUTTON]:
    "Menu lateral - Aba Exercícios - Botão Finalizar Treino",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_HOME_TABS_EXERCISES_FINALIZE_EXERCISE_BUTTON]:
    "Menu lateral - Aba Exercícios - Botão Finalizar Exercício",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_HOME_TABS_EXERCISES_USER_GPS_BUTTON]:
    "Menu lateral - Aba Exercícios - Botão GPS do Usuário",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_HOME_TABS_CARDIO]:
    "Menu lateral - Aba Cardio",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_HOME_TABS_FINANCIAL]:
    "Menu lateral - Aba Financeiro",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_USERS]: "Menu lateral - Usuários",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_USERS_VISUALIZE]:
    "Menu lateral - Usuários - Visualizar",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_USERS_ADD]:
    "Menu lateral - Usuários - Adicionar",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_USERS_DELETE]:
    "Menu lateral - Usuários - Excluir",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_USERS_UPDATE]:
    "Menu lateral - Usuários - Atualizar",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_ACADEMIES]:
    "Menu lateral - Academias",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_ACADEMIES_VISUALIZE]:
    "Menu lateral - Academias - Visualizar",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_ACADEMIES_ADD]:
    "Menu lateral - Academias - Adicionar",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_ACADEMIES_DELETE]:
    "Menu lateral - Academias - Excluir",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_ACADEMIES_UPDATE]:
    "Menu lateral - Academias - Atualizar",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_EXERCISES]:
    "Menu lateral - Exercícios",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_EXERCISES_VISUALIZE]:
    "Menu lateral - Exercícios - Visualizar",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_EXERCISES_ADD]:
    "Menu lateral - Exercícios - Adicionar",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_EXERCISES_DELETE]:
    "Menu lateral - Exercícios - Excluir",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_EXERCISES_UPDATE]:
    "Menu lateral - Exercícios - Atualizar",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_TRAININGS]: "Menu lateral - Treinos",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_TRAININGS_VISUALIZE]:
    "Menu lateral - Treinos - Visualizar",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_TRAININGS_ADD]:
    "Menu lateral - Treinos - Adicionar",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_TRAININGS_DELETE]:
    "Menu lateral - Treinos - Excluir",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_TRAININGS_UPDATE]:
    "Menu lateral - Treinos - Atualizar",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_TRAINING_BY_USER_LIST]:
    "Menu lateral - Treinos por Usuário",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_TRAINING_BY_USER_LIST_VISUALIZE]:
    "Menu lateral - Treinos por Usuário - Visualizar",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_TRAINING_BY_USER_LIST_ADD]:
    "Menu lateral - Treinos por Usuário - Adicionar",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_TRAINING_BY_USER_LIST_DELETE]:
    "Menu lateral - Treinos por Usuário - Excluir",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_TRAINING_BY_USER_LIST_UPDATE]:
    "Menu lateral - Treinos por Usuário - Atualizar",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_USER_SETTINGS]:
    "Menu lateral - Configurações do Usuário",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_USER_SETTINGS_RESET_DATA_BUTTON]:
    "Menu lateral - Configurações do Usuário - Botão Redefinir Dados",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_CHARTS]: "Menu lateral - Gráficos",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_CHARTS_VISUALIZE]:
    "Menu lateral - Gráficos - Visualizar",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_CHARTS_DELETE_HISTORY_BUTTON]:
    "Menu lateral - Gráficos - Botão Excluir Histórico",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_CHARTS_DELETE_ALL_HISTORY_BUTTON]:
    "Menu lateral - Gráficos - Botão Excluir Todo Histórico",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_GROUPS]: "Menu lateral - Grupos",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_GROUPS_CHANGE_ACADEMY_BUTTON]:
    "Menu lateral - Grupos - Botão Alterar Academia",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_GROUPS_ADD]:
    "Menu lateral - Grupos - Adicionar",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_GROUPS_DELETE]:
    "Menu lateral - Grupos - Excluir",
  [AppMessagesEnum.PERMISSION_DRAWER_MENU_GROUPS_UPDATE]:
    "Menu lateral - Grupos - Atualizar",

  // #endregion Permissions
};
