import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import {
  Home, Users, DollarSign, Calendar, AlertTriangle, Settings,
  Menu, X, Plus, Edit2, Trash2, Search, Printer, MessageCircle,
  Save, LogOut, CheckCircle, RotateCcw, Copy, BarChart2,
  TrendingUp, TrendingDown, Gift, Upload, Globe, HardDrive, Download, UploadCloud,
  Swords, Star, Activity, Zap, Shield, Trophy, Bot, Shirt, ClipboardList
} from 'lucide-react';

import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, deleteDoc, onSnapshot, collection, addDoc } from 'firebase/firestore';

const translations = {
  'pt-BR': {
    login_title: "MESTRES DA BOLA", login_sub: "Entre com 'admin123' ou 'consulta123'", password: "Senha", enter: "ENTRAR", wrong_pass: "Senha incorreta!",
    nav_dashboard: "Painel", nav_cashbook: "Livro Caixa", nav_members: "Cadastro de Atletas", nav_attendance: "Lista de Presença", nav_monthly: "Mensalidades", nav_defaulters: "Inadimplentes", nav_birthdays: "Aniversariantes", nav_draw: "Sorteio de Times", nav_settings: "Configurações",
    tab_game: "JOGO", tab_fin: "FINANCEIRO",
    profile: "Perfil", admin: "Admin", viewer: "Consulta", logout: "Sair", print: "Imprimir", print_toast: "Se não abrir, pressione Ctrl+P.", new: "Novo", save: "Salvar", cancel: "Cancelar", confirm: "Confirmar", update: "Atualizar", actions: "Ações",
    dash_assoc: "ASSOCIADOS", dash_bal: "SALDO", dash_inc_m: "REC (MÊS)", dash_exp_m: "DESP (MÊS)", annual_bal: "DRE (Anual)", tot_inc: "(+) Receitas", tot_exp: "(-) Despesas", annual_res: "(=) Resultado", perf_cat: "Desempenho", incomes: "Receitas", expenses: "Despesas", no_inc: "Sem receitas.", no_exp: "Sem despesas.", fin_evo: "Evolução",
    cb_entries: "Entradas", cb_exits: "Saídas", cb_month_bal: "Saldo Mês", date: "Data", desc: "Descrição", cat: "Categoria", amount: "Valor", revenue: "Receita", expense: "Despesa", del_tx: "Excluir", del_tx_msg: "Tem certeza que deseja apagar?", edit_tx: "Editar", new_tx: "Novo Lançamento", fill_fields: "Preencha tudo.", invalid_val: "Valor inválido.", what_cat: "Qual categoria?", tx_saved: "Salvo na nuvem!", tx_updated: "Atualizado na nuvem!", tx_deleted: "Apagado!",
    assoc_search: "Buscar associado...", photo: "Foto", name: "Nome", num: "Nº", pos: "Posição", entry: "Entrada", status: "Status", prof_pic: "Foto", full_name: "Nome Completo", shirt_num: "Camisa", whatsapp: "WhatsApp", birth: "Nascimento", entry_date: "Data Entrada", fee: "Mensalidade (R$)", gk: "Goleiro", def: "Zagueiro", lb: "Lateral", mid: "Meia", atk: "Atacante", none: "Nenhuma", active: "Sócio Ativo", inactive: "Sócio Inativo", name_req: "Nome obrigatório.", assoc_updated: "Atualizado!", assoc_saved: "Cadastrado na nuvem!", assoc_deleted: "Removido!",
    playing_today: "Joga Hoje?", deselect_all: "Zerar Presenças", reset_msg: "Deseja desmarcar todos para o jogo de hoje?", reset_succ: "Presenças zeradas!", playing: "Vai Jogar", not_playing: "Não Joga", overall: "GERAL",
    month_ctrl: "Controle", receive_from: "Receber de", options: "Opções", refund: "Estornar", refund_msg: "Anular e apagar do Caixa?", receipt: "Recibo", ref: "Referência:", paid_val: "Valor Pago:", close: "Fechar", copy_wpp: "Copiar p/ WhatsApp", pending: "Pendente", refund_success: "Estornado!", pay_success: "Pago com sucesso!", wpp_opened: "WhatsApp aberto!", wpp_no_num: "Sem número, copiado!",
    def_rep: "Relatório de Inadimplência", copy_all: "Copiar Geral", pend_per: "Pendentes", total: "Total", action: "Ação", all_good: "Todos em dia.", no_def: "Nenhum inadimplente!", rep_copied: "Relatório copiado!",
    bday_none: "Sem aniversariantes.", age: "Idade", years: "anos", send: "Enviar Feliz Aniversário", player: "JOGADOR",
    set_club: "Configurações do Clube", club_name: "Nome do Clube", club_logo: "Símbolo", sec_pass: "Senhas", pass_admin: "Senha Admin", pass_view: "Senha Consulta", click_change: "Alterar", set_saved: "Salvo!", pass_saved: "Senhas atualizadas!", local_mode: "Modo Nuvem", backup: "Backup", export: "Exportar", import: "Importar", data_imported: "Importado!", cloud_sync: "Sincronizado",
    lbl_weight: "Peso (kg)", lbl_height: "Altura (m)", lbl_speed: "Velocidade", lbl_foot: "Pé", lbl_strength: "Força", lbl_skill: "Habilidade (1-5)", lbl_pos2: "Posição Secundária",
    vel_low: "Baixo", vel_nor: "Normal", vel_fast: "Rápido", foot_r: "Direito", foot_l: "Esquerdo", foot_b: "Ambos", str_light: "Leve", str_nor: "Normal", str_strong: "Forte",
    draw_title: "Sorteio de Times", draw_num: "Número de Times:", draw_btn: "SORTEAR AGORA", redraw_btn: "REFAZER", draw_desc: "O algoritmo equilibra usando habilidade, peso, posição, velocidade e força.", draw_err: "Selecione pelo menos {num} jogadores.", draw_succ: "Sorteio realizado!",
    team: "Time", avg_age: "Idade Méd", avg_bmi: "IMC Méd", total_force: "Força Total", ai_btn: "Resenha Pré-Jogo com IA",
    ai_1: "Pessoal, que dia de futebol! O equilíbrio foi calculado milimetricamente. Vai sair faísca, que vença o melhor!", ai_2: "Análise concluída: A tática e o vigor físico vão decidir hoje. Palpite: muitos gols, divididas fortes e nenhuma paciência com o árbitro!", ai_3: "Futebol espetáculo hoje! Ninguém ficou com 'o time de ouro'. Torneio nivelado por cima!"
  },
  'en': {
    login_title: "FOOTBALL MASTERS", login_sub: "Log in with 'admin123' or 'consulta123'", password: "Password", enter: "LOGIN", wrong_pass: "Incorrect password!",
    nav_dashboard: "Dashboard", nav_cashbook: "Cash Book", nav_members: "Athlete Reg.", nav_attendance: "Attendance List", nav_monthly: "Monthly Fees", nav_defaulters: "Defaulters", nav_birthdays: "Birthdays", nav_draw: "Team Draw", nav_settings: "Settings",
    tab_game: "GAME", tab_fin: "FINANCIAL",
    profile: "Profile", admin: "Admin", viewer: "Viewer", logout: "Logout", print: "Print", print_toast: "Press Ctrl+P.", new: "New", save: "Save", cancel: "Cancel", confirm: "Confirm", update: "Update", actions: "Actions",
    dash_assoc: "MEMBERS", dash_bal: "BALANCE", dash_inc_m: "INC (MO)", dash_exp_m: "EXP (MO)", annual_bal: "Annual Statement", tot_inc: "(+) Incomes", tot_exp: "(-) Expenses", annual_res: "(=) Net", perf_cat: "Performance", incomes: "Incomes", expenses: "Expenses", no_inc: "No income.", no_exp: "No expenses.", fin_evo: "Evolution",
    cb_entries: "Entries", cb_exits: "Exits", cb_month_bal: "Month Bal", date: "Date", desc: "Description", cat: "Category", amount: "Amount", revenue: "Revenue", expense: "Expense", del_tx: "Delete", del_tx_msg: "Are you sure?", edit_tx: "Edit", new_tx: "New", fill_fields: "Fill all.", invalid_val: "Invalid.", what_cat: "Category?", tx_saved: "Saved to cloud!", tx_updated: "Updated!", tx_deleted: "Deleted!",
    assoc_search: "Search...", photo: "Photo", name: "Name", num: "No.", pos: "Position", entry: "Entry", status: "Status", prof_pic: "Pic", full_name: "Full Name", shirt_num: "Number", whatsapp: "WhatsApp", birth: "Birth", entry_date: "Entry Date", fee: "Fee ($)", gk: "Goalkeeper", def: "Defender", lb: "Fullback", mid: "Midfielder", atk: "Forward", none: "None", active: "Active Member", inactive: "Inactive Member", name_req: "Name required.", assoc_updated: "Updated!", assoc_saved: "Saved!", assoc_deleted: "Deleted!",
    playing_today: "Playing Today?", deselect_all: "Reset Match", reset_msg: "Deselect all players for today's match?", reset_succ: "Match reset!", playing: "Playing", not_playing: "Out", overall: "OVR",
    month_ctrl: "Control", receive_from: "Receive", options: "Options", refund: "Refund", refund_msg: "Delete payment?", receipt: "Receipt", ref: "Ref:", paid_val: "Paid:", close: "Close", copy_wpp: "Copy Wpp", pending: "Pending", refund_success: "Refunded!", pay_success: "Success!", wpp_opened: "Opened!", wpp_no_num: "Copied!",
    def_rep: "Defaulters", copy_all: "Copy All", pend_per: "Pending", total: "Total", action: "Action", all_good: "All good.", no_def: "No defaulters!", rep_copied: "Copied!",
    bday_none: "No birthdays.", age: "Age", years: "yrs", send: "Send Happy B-Day", player: "PLAYER",
    set_club: "Club Settings", club_name: "Name", club_logo: "Logo", sec_pass: "Security", pass_admin: "Admin Pass", pass_view: "View Pass", click_change: "Change", set_saved: "Saved!", pass_saved: "Updated!", local_mode: "Cloud Mode", backup: "Backup", export: "Export", import: "Import", data_imported: "Imported!", cloud_sync: "Synced",
    lbl_weight: "Weight (kg)", lbl_height: "Height (m)", lbl_speed: "Speed", lbl_foot: "Foot", lbl_strength: "Strength", lbl_skill: "Skill (1-5)", lbl_pos2: "Sec. Position",
    vel_low: "Slow", vel_nor: "Normal", vel_fast: "Fast", foot_r: "Right", foot_l: "Left", foot_b: "Both", str_light: "Light", str_nor: "Normal", str_strong: "Strong",
    draw_title: "Team Draw", draw_num: "Teams:", draw_btn: "DRAW NOW", redraw_btn: "REDRAW", draw_desc: "Balances teams using skill, weight, position, speed, and strength.", draw_err: "Select at least {num} players.", draw_succ: "Teams drafted!", team: "Team", avg_age: "Avg Age", avg_bmi: "Avg BMI", total_force: "Total Strength", ai_btn: "Pre-Game AI Review",
    ai_1: "Guys, what a matchday! Perfect balance. Sparks will fly, may the best win!", ai_2: "Analysis: Tactics and stamina decide today. Expect goals and no patience for the ref!", ai_3: "Showtime! No 'golden team' today. Evenly matched, details will define the champion!"
  },
  'es': {
    login_title: "MAESTROS DEL BALÓN", login_sub: "Ingresa con 'admin123' o 'consulta123'", password: "Contraseña", enter: "ENTRAR", wrong_pass: "¡Contraseña incorrecta!",
    nav_dashboard: "Panel", nav_cashbook: "Libro Caja", nav_members: "Registro de Atletas", nav_attendance: "Lista de Asistencia", nav_monthly: "Mensualidades", nav_defaulters: "Morosos", nav_birthdays: "Cumpleaños", nav_draw: "Sorteo de Equipos", nav_settings: "Configuración",
    tab_game: "JUEGO", tab_fin: "FINANCIERO",
    profile: "Perfil", admin: "Admin", viewer: "Consulta", logout: "Salir", print: "Imprimir", print_toast: "Si no abre, presiona Ctrl+P.", new: "Nuevo", save: "Guardar", cancel: "Cancelar", confirm: "Confirmar", update: "Actualizar", actions: "Acciones",
    dash_assoc: "SOCIOS", dash_bal: "SALDO", dash_inc_m: "ING (MES)", dash_exp_m: "GAS (MES)", annual_bal: "Estado Anual", tot_inc: "(+) Ingresos", tot_exp: "(-) Gastos", annual_res: "(=) Resultado", perf_cat: "Rendimiento", incomes: "Ingresos", expenses: "Gastos", no_inc: "Sin ingresos.", no_exp: "Sin gastos.", fin_evo: "Evolución",
    cb_entries: "Entradas", cb_exits: "Salidas", cb_month_bal: "Saldo Mes", date: "Fecha", desc: "Descripción", cat: "Categoría", amount: "Monto", revenue: "Ingreso", expense: "Gasto", del_tx: "Eliminar", del_tx_msg: "¿Estás seguro?", edit_tx: "Editar", new_tx: "Nuevo", fill_fields: "Llena todo.", invalid_val: "Monto inválido.", what_cat: "¿Categoría?", tx_saved: "¡Guardado en la nube!", tx_updated: "¡Actualizado!", tx_deleted: "¡Eliminado!",
    assoc_search: "Buscar...", photo: "Foto", name: "Nombre", num: "Nº", pos: "Posición", entry: "Ingreso", status: "Estado", prof_pic: "Foto", full_name: "Nombre Completo", shirt_num: "Camiseta", whatsapp: "WhatsApp", birth: "Nacimiento", entry_date: "Fecha Ingreso", fee: "Cuota ($)", gk: "Portero", def: "Defensa", lb: "Lateral", mid: "Medio", atk: "Delantero", none: "Ninguna", active: "Activo", inactive: "Inactivo", name_req: "Nombre requerido.", assoc_updated: "¡Actualizado!", assoc_saved: "¡Registrado!", assoc_deleted: "¡Eliminado!",
    playing_today: "¿Juega Hoy?", deselect_all: "Reiniciar Asistencia", reset_msg: "¿Desmarcar a todos para el juego de hoy?", reset_succ: "¡Lista reiniciada!", playing: "Juega", not_playing: "No Juega", overall: "GEN",
    month_ctrl: "Control", receive_from: "Recibir de", options: "Opciones", refund: "Reembolsar", refund_msg: "¿Anular pago?", receipt: "Recibo", ref: "Ref:", paid_val: "Pagado:", close: "Cerrar", copy_wpp: "Copiar Wpp", pending: "Pendiente", refund_success: "¡Reembolsado!", pay_success: "¡Éxito!", wpp_opened: "¡Abierto!", wpp_no_num: "¡Copiado!",
    def_rep: "Morosos", copy_all: "Copiar Todo", pend_per: "Pendiente", total: "Total", action: "Acción", all_good: "Todo al día.", no_def: "¡Sin morosos!", rep_copied: "¡Copiado!",
    bday_none: "Sin cumpleaños.", age: "Edad", years: "años", send: "Enviar Feliz Cumple", player: "JUGADOR",
    set_club: "Configuración", club_name: "Nombre", club_logo: "Escudo", sec_pass: "Seguridad", pass_admin: "Clave Admin", pass_view: "Clave Consulta", click_change: "Cambiar", set_saved: "¡Guardado!", pass_saved: "¡Actualizado!", local_mode: "Modo Nube", backup: "Respaldo", export: "Exportar", import: "Importar", data_imported: "¡Importado!", cloud_sync: "Sincronizado",
    lbl_weight: "Peso (kg)", lbl_height: "Altura (m)", lbl_speed: "Velocidad", lbl_foot: "Pie", lbl_strength: "Fuerza", lbl_skill: "Habilidad (1-5)", lbl_pos2: "Posición Sec.",
    vel_low: "Lento", vel_nor: "Normal", vel_fast: "Rápido", foot_r: "Derecho", foot_l: "Izquierdo", foot_b: "Ambos", str_light: "Ligero", str_nor: "Normal", str_strong: "Fuerte",
    draw_title: "Sorteo de Equipos", draw_num: "Equipos:", draw_btn: "SORTEAR AHORA", redraw_btn: "REHACER", draw_desc: "Equilibra usando habilidad, peso, posición, velocidad y fuerza.", draw_err: "Selecciona al menos {num} jugadores.", draw_succ: "¡Sorteo listo!", team: "Equipo", avg_age: "Edad Med", avg_bmi: "IMC Med", total_force: "Fuerza Total", ai_btn: "Reseña IA",
    ai_1: "¡Qué partido! Equilibrio perfecto. ¡Que gane el mejor!", ai_2: "Táctica y vigor deciden hoy. ¡Muchos goles y cero paciencia!", ai_3: "¡Fútbol espectáculo! Torneo nivelado por lo alto."
  },
  'fr': {
    login_title: "MAÎTRES DU BALLON", login_sub: "Connectez-vous avec 'admin123' ou 'consulta123'", password: "Mot de passe", enter: "ENTRER", wrong_pass: "Mot de passe incorrect!",
    nav_dashboard: "Tableau de bord", nav_cashbook: "Livre de Caisse", nav_members: "Reg. Athlète", nav_attendance: "Liste de Présence", nav_monthly: "Mensualités", nav_defaulters: "Débiteurs", nav_birthdays: "Anniversaires", nav_draw: "Tirage au Sort", nav_settings: "Paramètres",
    tab_game: "JEU", tab_fin: "FINANCIER",
    profile: "Profil", admin: "Admin", viewer: "Consultation", logout: "Déconnexion", print: "Imprimer", print_toast: "Appuyez sur Ctrl+P.", new: "Nouveau", save: "Enregistrer", cancel: "Annuler", confirm: "Confirmer", update: "Mettre à jour", actions: "Actions",
    dash_assoc: "MEMBRES", dash_bal: "SOLDE", dash_inc_m: "REV (MOIS)", dash_exp_m: "DÉP (MOIS)", annual_bal: "Bilan Annuel", tot_inc: "(+) Recettes", tot_exp: "(-) Dépenses", annual_res: "(=) Net", perf_cat: "Performance", incomes: "Recettes", expenses: "Dépenses", no_inc: "Aucune recette.", no_exp: "Aucune dépense.", fin_evo: "Évolution",
    cb_entries: "Entrées", cb_exits: "Sorties", cb_month_bal: "Solde Mois", date: "Date", desc: "Description", cat: "Catégorie", amount: "Montant", revenue: "Recette", expense: "Dépense", del_tx: "Supprimer", del_tx_msg: "Êtes-vous sûr?", edit_tx: "Modifier", new_tx: "Nouveau", fill_fields: "Remplissez tout.", invalid_val: "Invalide.", what_cat: "Catégorie?", tx_saved: "Enregistré dans le cloud!", tx_updated: "Mis à jour!", tx_deleted: "Supprimé!",
    assoc_search: "Rechercher...", photo: "Photo", name: "Nom", num: "Nº", pos: "Position", entry: "Entrée", status: "Statut", prof_pic: "Photo", full_name: "Nom Complet", shirt_num: "Maillot", whatsapp: "WhatsApp", birth: "Naissance", entry_date: "Date d'Entrée", fee: "Frais (€)", gk: "Gardien", def: "Défenseur", lb: "Latéral", mid: "Milieu", atk: "Attaquant", none: "Aucune", active: "Actif", inactive: "Inactif", name_req: "Nom requis.", assoc_updated: "Mis à jour!", assoc_saved: "Enregistré!", assoc_deleted: "Supprimé!",
    playing_today: "Joue Aujourd'hui?", deselect_all: "Réinitialiser", reset_msg: "Désélectionner tous les joueurs?", reset_succ: "Liste réinitialisée!", playing: "Joue", not_playing: "Ne Joue Pas", overall: "GEN",
    month_ctrl: "Contrôle", receive_from: "Recevoir", options: "Options", refund: "Rembourser", refund_msg: "Annuler paiement?", receipt: "Reçu", ref: "Réf:", paid_val: "Payé:", close: "Fermer", copy_wpp: "Copier Wpp", pending: "En attente", refund_success: "Remboursé!", pay_success: "Succès!", wpp_opened: "Ouvert!", wpp_no_num: "Copié!",
    def_rep: "Débiteurs", copy_all: "Tout Copier", pend_per: "En attente", total: "Total", action: "Action", all_good: "Tout à jour.", no_def: "Aucun débiteur!", rep_copied: "Copié!",
    bday_none: "Pas d'anniversaires.", age: "Âge", years: "ans", send: "Envoyer Joyeux Anniv", player: "JOUEUR",
    set_club: "Paramètres", club_name: "Nom", club_logo: "Logo", sec_pass: "Sécurité", pass_admin: "Mdp Admin", pass_view: "Mdp Consultation", click_change: "Changer", set_saved: "Enregistré!", pass_saved: "Mis à jour!", local_mode: "Mode Cloud", backup: "Sauvegarde", export: "Exporter", import: "Importer", data_imported: "Importé!", cloud_sync: "Synchronisé",
    lbl_weight: "Poids (kg)", lbl_height: "Taille (m)", lbl_speed: "Vitesse", lbl_foot: "Pied", lbl_strength: "Force", lbl_skill: "Compétence (1-5)", lbl_pos2: "Position Sec.",
    vel_low: "Lent", vel_nor: "Normal", vel_fast: "Rapide", foot_r: "Droit", foot_l: "Gauche", foot_b: "Les deux", str_light: "Léger", str_nor: "Normal", str_strong: "Fort",
    draw_title: "Tirage au Sort", draw_num: "Équipes:", draw_btn: "TIRER AU SORT", redraw_btn: "REFAIRE", draw_desc: "Équilibre via compétence, poids, position, vitesse et force.", draw_err: "Sélectionnez au moins {num} joueurs.", draw_succ: "Tirage réussi!", team: "Équipe", avg_age: "Âge Moy", avg_bmi: "IMC Moy", total_force: "Force Totale", ai_btn: "Analyse IA",
    ai_1: "Quel match! Équilibre parfait. Que le meilleur gagne!", ai_2: "Tactique et vigueur décident aujourd'hui. Zéro patience!", ai_3: "Football spectacle! Tournoi nivelé vers le haut."
  }
};

const checkValidPeriod = (member, year, month) => {
  if (!member || !member.entryDate) return true;
  const parts = member.entryDate.split('-');
  if (parts.length < 2) return true;
  const entryYear = parseInt(parts[0], 10);
  const entryMonth = parseInt(parts[1], 10);
  const checkYear = parseInt(year, 10);
  const checkMonth = parseInt(month, 10);
  return checkYear > entryYear || (checkYear === entryYear && checkMonth >= entryMonth);
};

const safeWhatsAppOpen = (phone, msg) => {
  if(!phone) return;
  let cleanPhone = phone.replace(/\D/g, '');
  if (!cleanPhone.startsWith('55')) cleanPhone = '55' + cleanPhone;
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  try { navigator.clipboard.writeText(msg); } catch(e) {}
};

const calcularIMC = (peso, altura) => {
  if (!peso || peso <= 0) return 0;
  const alt = (altura && altura > 0) ? altura : 1.75; 
  return parseFloat((peso / (alt * alt)).toFixed(1));
};

const calcularOverall = (member) => {
  const habilidade = member.skill || 3;
  const anoNasc = member.birthDate ? parseInt(member.birthDate.split('-')[0], 10) : 1996;
  const imc = calcularIMC(member.weight, member.height);
  const velocidade = member.speed || "NORMAL";
  const pe = member.foot || "DIREITO";
  const forca = member.strength || "NORMAL";

  let base = 45 + (habilidade * 8); 
  const idade = new Date().getFullYear() - anoNasc;

  if (imc >= 20 && imc <= 25) base += 5; 
  else if (imc > 25 && imc <= 30) base += 1; 
  else if (imc < 20) base += 1; 
  else base -= 6; 

  if (idade >= 18 && idade <= 28) base += 4; 
  else if (idade > 28 && idade <= 36) base += 6; 
  else if (idade > 36 && idade <= 45) base += 2; 
  else base -= 3; 

  if (velocidade === "RAPIDO") base += 4;
  else if (velocidade === "BAIXO") base -= 3;

  if (forca === "FORTE") base += 3;
  else if (forca === "LEVE") base -= 2;

  if (pe === "AMBOS") base += 3;

  return Math.min(99, Math.max(1, Math.round(base)));
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('mb_lang') || 'pt-BR'; } catch(e) { return 'pt-BR'; }
  });

  useEffect(() => { 
    try { localStorage.setItem('mb_lang', lang); } catch(e) {} 
  }, [lang]);

  const t = (key) => (translations[lang] || translations['pt-BR'])[key] || key;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat(lang === 'en' ? 'en-US' : (lang === 'pt-BR' ? 'pt-BR' : lang === 'es' ? 'es-ES' : 'fr-FR'), { style: 'currency', currency: 'BRL' }).format(Number(value) || 0);
  };

  const showToast = (msg, type = 'success') => {
    setToastMsg({ message: msg, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  const triggerPrint = () => {
    window.print();
    showToast(t('print_toast'), 'success');
  };

  return (
    <AppContext.Provider value={{ userRole, setUserRole, toastMsg, setToastMsg, showToast, triggerPrint, lang, setLang, t, formatCurrency }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

const useCloudDatabase = () => {
  const { showToast, t } = useAppContext();
  
  // App Identifiers and Auth setup
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
  const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
  
  const app = useMemo(() => initializeApp(firebaseConfig), []);
  const auth = useMemo(() => getAuth(app), [app]);
  const db = useMemo(() => getFirestore(app), [app]);

  const [user, setUser] = useState(null);
  
  // Database States
  const [settings, setSettings] = useState({ clubName: 'Mestres da Bola', logoUrl: '' });
  const [passwords, setPasswords] = useState({ admin: 'admin123', consulta: 'consulta123' });
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [payments, setPayments] = useState([]);
  
  // Loading indicators for all 5 collections/docs
  const [loadState, setLoadState] = useState({ settings: false, passwords: false, members: false, txs: false, pays: false });
  const loadingData = !loadState.settings || !loadState.passwords || !loadState.members || !loadState.txs || !loadState.pays;

  // 1. Setup Auth (Mandatory before queries)
  useEffect(() => {
    let isMounted = true;
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth error", error);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (isMounted) setUser(u);
    });
    return () => { isMounted = false; unsubscribe(); };
  }, [auth]);

  // 2. Setup Real-time Listeners (Guarded by user auth)
  useEffect(() => {
    if (!user) return;
    
    // Path: /artifacts/{appId}/public/data/
    const settingsDoc = doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'global');
    const unsubSettings = onSnapshot(settingsDoc, (snapshot) => {
      if (snapshot.exists()) setSettings(snapshot.data());
      setLoadState(p => ({ ...p, settings: true }));
    }, (err) => { console.error(err); setLoadState(p => ({ ...p, settings: true })); });

    const passwordsDoc = doc(db, 'artifacts', appId, 'public', 'data', 'passwords', 'global');
    const unsubPass = onSnapshot(passwordsDoc, (snapshot) => {
      if (snapshot.exists()) setPasswords(snapshot.data());
      setLoadState(p => ({ ...p, passwords: true }));
    }, (err) => { console.error(err); setLoadState(p => ({ ...p, passwords: true })); });

    const membersCol = collection(db, 'artifacts', appId, 'public', 'data', 'members');
    const unsubMembers = onSnapshot(membersCol, (snapshot) => {
      setMembers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoadState(p => ({ ...p, members: true }));
    }, (err) => { console.error(err); setLoadState(p => ({ ...p, members: true })); });

    const txsCol = collection(db, 'artifacts', appId, 'public', 'data', 'transactions');
    const unsubTxs = onSnapshot(txsCol, (snapshot) => {
      setTransactions(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoadState(p => ({ ...p, txs: true }));
    }, (err) => { console.error(err); setLoadState(p => ({ ...p, txs: true })); });

    const paysCol = collection(db, 'artifacts', appId, 'public', 'data', 'payments');
    const unsubPays = onSnapshot(paysCol, (snapshot) => {
      setPayments(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoadState(p => ({ ...p, pays: true }));
    }, (err) => { console.error(err); setLoadState(p => ({ ...p, pays: true })); });

    return () => {
      unsubSettings(); unsubPass(); unsubMembers(); unsubTxs(); unsubPays();
    };
  }, [user, db, appId]);

  // Firestore Mutation Functions
  const saveSettings = async (newSettings) => {
    if (!user) return;
    await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'global'), newSettings);
    showToast(t('set_saved'));
  };

  const savePasswords = async (newPass) => {
    if (!user) return;
    await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'passwords', 'global'), newPass);
    showToast(t('pass_saved'));
  };

  const saveMember = async (mData) => {
    if (!user) return;
    const cleanedMember = {
      ...mData,
      weight: mData.weight || 75,
      height: mData.height || 1.75,
      speed: mData.speed || 'NORMAL',
      foot: mData.foot || 'DIREITO',
      strength: mData.strength || 'NORMAL',
      skill: mData.skill || 3,
      secondaryPosition: mData.secondaryPosition || 'NENHUMA',
      isPlaying: mData.isPlaying !== undefined ? mData.isPlaying : true
    };
    
    // id is managed by firestore or strictly maintained
    if (cleanedMember.id) {
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'members', cleanedMember.id), cleanedMember, { merge: true });
      showToast(t('assoc_updated'));
    } else {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'members'), cleanedMember);
      showToast(t('assoc_saved'));
    }
  };

  const deleteMember = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'members', id));
    showToast(t('assoc_deleted'));
  };
  
  const addTransaction = async (data) => {
    if (!user) return;
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'transactions'), data);
    showToast(t('tx_saved'));
  };

  const updateTransaction = async (id, data) => {
    if (!user) return;
    await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'transactions', id), data, { merge: true });
    showToast(t('tx_updated'));
  };

  const deleteTransaction = async (id) => {
    if (!user) return;
    const tx = transactions.find(t => t.id === id);
    if (tx && tx.category === 'Mensalidades' && (tx.description || '').startsWith('Mensalidade')) {
       const pay = payments.find(p => `Mensalidade ${p.periodLabel}/${p.year} - ${p.memberName}` === tx.description);
       if (pay) {
          await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'payments', pay.id));
       }
    }
    await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'transactions', id));
    showToast(t('tx_deleted'));
  };

  const savePayment = async (data) => {
    if (!user) return;
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'payments'), data);
  };

  const refundPayment = async (paymentId, txDesc) => {
    if (!user) return;
    await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'payments', paymentId));
    
    const tx = transactions.find(t => t.description === txDesc && !t.isRefunded);
    if (tx) {
        await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'transactions', tx.id));
    }
    showToast(t('refund_success'));
  };

  const resetMatchRoster = async () => {
    if (!user) return;
    // Iterate and update all active members who are currently set to playing
    const playingMembers = members.filter(m => m.isPlaying);
    for (const m of playingMembers) {
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'members', m.id), { ...m, isPlaying: false }, { merge: true });
    }
    showToast(t('reset_succ'));
  };

  const importData = async (imported) => {
     if (!user) return;
     if(imported.settings) await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'global'), imported.settings);
     if(imported.passwords) await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'passwords', 'global'), imported.passwords);
     
     if(imported.members) {
         for (const m of imported.members) {
             const mId = m.id || Date.now().toString() + Math.random();
             await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'members', mId), m);
         }
     }
     if(imported.transactions) {
         for (const t of imported.transactions) {
             const tId = t.id || Date.now().toString() + Math.random();
             await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'transactions', tId), t);
         }
     }
     if(imported.payments) {
         for (const p of imported.payments) {
             const pId = p.id || Date.now().toString() + Math.random();
             await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'payments', pId), p);
         }
     }
     showToast(t('data_imported'));
  };

  return { settings, passwords, members, transactions, payments, loadingData, saveSettings, savePasswords, saveMember, deleteMember, addTransaction, updateTransaction, deleteTransaction, savePayment, refundPayment, importData, resetMatchRoster };
};

const LanguageSwitcher = ({ isLogin = false }) => {
  const { lang, setLang } = useAppContext();
  return (
    <div className={`flex items-center gap-2 ${isLogin ? 'justify-center mb-6' : 'px-4 py-2 mt-auto border-t border-emerald-800'}`}>
      <Globe size={16} className={isLogin ? 'text-gray-400' : 'text-emerald-400'} />
      <select value={lang} onChange={(e) => setLang(e.target.value)} className={`bg-transparent outline-none cursor-pointer text-sm font-medium ${isLogin ? 'text-gray-600 border-b border-gray-300 pb-1' : 'text-emerald-200 hover:text-white'}`}>
        <option value="pt-BR" className="text-black">🇧🇷 PT-BR</option>
        <option value="en" className="text-black">🇺🇸 EN</option>
        <option value="es" className="text-black">🇪🇸 ES</option>
        <option value="fr" className="text-black">🇫🇷 FR</option>
      </select>
    </div>
  );
};

const ImageUploader = ({ currentImage, onImageChange, label }) => {
  const { t } = useAppContext();
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = 250 / img.width;
        canvas.width = 250; canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        onImageChange(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };
  return (
    <div className="flex flex-col items-center gap-2 my-4">
      <label className="block text-sm font-medium text-gray-700 w-full text-left">{label}</label>
      <div className="relative group cursor-pointer w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-emerald-500 transition-colors bg-gray-50">
        {currentImage ? <img src={currentImage} alt="Preview" className="w-full h-full object-cover" /> : <Upload className="text-gray-400 group-hover:text-emerald-500" size={24} />}
        <input type="file" accept="image/*" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
      </div>
      <p className="text-xs text-gray-400">{t('click_change')}</p>
    </div>
  );
};

const StarRating = ({ value, onChange }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button key={star} type="button" onClick={() => onChange(star)} className="focus:outline-none transition-transform hover:scale-110">
          <Star size={24} className={star <= value ? 'fill-yellow-400 text-yellow-500' : 'text-gray-300'} />
        </button>
      ))}
    </div>
  );
};

const Toast = ({ message, type, onClose }) => {
  if (!message) return null;
  return (
    <div className={`fixed bottom-4 right-4 ${type === 'error' ? 'bg-red-500' : 'bg-emerald-600'} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-bounce print:hidden`}>
      {type === 'success' && <CheckCircle size={20} />}
      {type === 'error' && <AlertTriangle size={20} />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 hover:text-gray-200"><X size={16} /></button>
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 print:hidden">
      <div className="bg-slate-50 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        <div className="bg-emerald-900 text-yellow-400 p-4 flex justify-between items-center shrink-0">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="hover:bg-emerald-800 rounded-full p-1 transition-colors"><X size={24} /></button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  const { t } = useAppContext();
  if (!isOpen) return null;
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <div className="space-y-4"><p className="text-gray-700">{message}</p><div className="flex gap-4 pt-4"><button onClick={onCancel} className="flex-1 bg-gray-200 p-3 rounded-lg font-medium hover:bg-gray-300">{t('cancel')}</button><button onClick={onConfirm} className="flex-1 bg-red-600 text-white p-3 rounded-lg font-bold hover:bg-red-700">{t('confirm')}</button></div></div>
    </Modal>
  );
};

const Dashboard = ({ stats, transactions, currentYear }) => {
  const { t, formatCurrency, lang } = useAppContext();

  const categoryFlow = useMemo(() => {
    const validTx = (transactions || []).filter(t => t.date && parseInt(t.date.split('-')[0], 10) === currentYear && !t.isRefunded);
    const inc = {}; const exp = {};
    validTx.forEach(t => { 
      const amount = Number(t.amount) || 0;
      if (t.type === 'income') { inc[t.category] = (inc[t.category] || 0) + amount; } 
      else { exp[t.category] = (exp[t.category] || 0) + amount; } 
    });
    return { incomes: Object.entries(inc).sort((a, b) => b[1] - a[1]), expenses: Object.entries(exp).sort((a, b) => b[1] - a[1]) };
  }, [transactions, currentYear]);

  const monthlyEvolution = useMemo(() => {
    const data = Array.from({ length: 12 }, (_, i) => ({ inc: 0, exp: 0, month: i }));
    (transactions || []).filter(t => t.date && parseInt(t.date.split('-')[0], 10) === currentYear && !t.isRefunded).forEach(t => {
      const parts = t.date.split('-');
      if(parts.length >= 2) {
        const m = parseInt(parts[1], 10) - 1;
        if (m >= 0 && m <= 11) {
          if (t.type === 'income') data[m].inc += Number(t.amount);
          else data[m].exp += Number(t.amount);
        }
      }
    });
    const maxVal = Math.max(...data.map(d => Math.max(d.inc, d.exp)), 1);
    return { data, maxVal };
  }, [transactions, currentYear]);

  return (
    <div className="space-y-6 fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-900 transition-transform hover:-translate-y-1"><div className="flex justify-between mb-2"><p className="text-sm font-bold text-gray-500">{t('dash_assoc')}</p><Users className="text-blue-900/40" size={24} /></div><p className="text-3xl font-black text-slate-800">{stats.activeMembers || 0}</p></div>
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-emerald-600 transition-transform hover:-translate-y-1"><div className="flex justify-between mb-2"><p className="text-sm font-bold text-gray-500">{t('dash_bal')}</p><DollarSign className="text-emerald-600/40" size={24} /></div><p className="text-3xl font-black text-emerald-600">{formatCurrency(stats.balance)}</p></div>
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-emerald-400 transition-transform hover:-translate-y-1"><div className="flex justify-between mb-2"><p className="text-sm font-bold text-gray-500">{t('dash_inc_m')}</p><TrendingUp className="text-emerald-400/40" size={24} /></div><p className="text-3xl font-black text-slate-800">{formatCurrency(stats.monthlyIncome)}</p></div>
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-red-400 transition-transform hover:-translate-y-1"><div className="flex justify-between mb-2"><p className="text-sm font-bold text-gray-500">{t('dash_exp_m')}</p><TrendingDown className="text-red-400/40" size={24} /></div><p className="text-3xl font-black text-slate-800">{formatCurrency(stats.monthlyExpense)}</p></div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow w-full print:hidden">
        <h3 className="font-bold text-blue-950 flex items-center gap-2 mb-6"><TrendingUp size={20} /> {t('fin_evo')} ({currentYear})</h3>
        <div className="flex items-end h-48 gap-2 w-full overflow-x-auto pb-2 border-b border-gray-100">
          {monthlyEvolution.data.map((d, i) => {
            const localeCode = lang === 'en' ? 'en-US' : (lang === 'pt-BR' ? 'pt-BR' : lang === 'es' ? 'es-ES' : 'fr-FR');
            const monthName = new Date(2024, i, 1).toLocaleString(localeCode, { month: 'short' }).toUpperCase();
            const incH = Math.max(0, (d.inc / monthlyEvolution.maxVal) * 100) || 0;
            const expH = Math.max(0, (d.exp / monthlyEvolution.maxVal) * 100) || 0;
            return (
              <div key={i} className="flex-1 flex flex-col justify-end items-center gap-1 min-w-[40px] group relative cursor-default">
                <div className="absolute -top-12 bg-slate-800 text-white text-xs p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                  <p className="text-emerald-400 font-bold">{t('incomes')}: {formatCurrency(d.inc)}</p>
                  <p className="text-red-400 font-bold">{t('expenses')}: {formatCurrency(d.exp)}</p>
                </div>
                <div className="flex w-full justify-center gap-1 items-end h-full">
                  <div className="w-full max-w-[24px] bg-emerald-400 rounded-t-sm hover:bg-emerald-500" style={{ height: `${incH}%`, minHeight: incH>0?'4px':'0' }}></div>
                  <div className="w-full max-w-[24px] bg-red-400 rounded-t-sm hover:bg-red-500" style={{ height: `${expH}%`, minHeight: expH>0?'4px':'0' }}></div>
                </div>
                <span className="text-[10px] font-bold text-gray-400 mt-2">{monthName.replace('.','')}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl shadow text-white flex flex-col justify-center gap-4">
          <h3 className="font-bold text-yellow-400 flex items-center gap-2 mb-2 border-b border-slate-700 pb-3"><Calendar size={20} /> {t('annual_bal')} ({currentYear})</h3>
          <div className="flex justify-between items-end border-b border-slate-700/50 pb-2"><p className="text-sm text-gray-400 font-bold">{t('tot_inc')}</p><p className="text-xl font-black text-emerald-400">{formatCurrency(stats.annualIncome)}</p></div>
          <div className="flex justify-between items-end border-b border-slate-700/50 pb-2"><p className="text-sm text-gray-400 font-bold">{t('tot_exp')}</p><p className="text-xl font-black text-red-400">{formatCurrency(stats.annualExpense)}</p></div>
          <div className="flex justify-between items-end pt-2 bg-slate-900/50 p-3 rounded-lg border border-slate-700"><p className="text-sm text-gray-300 font-black uppercase">{t('annual_res')}</p><p className={`text-2xl font-black ${stats.annualIncome - stats.annualExpense >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatCurrency(stats.annualIncome - stats.annualExpense)}</p></div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow lg:col-span-2">
          <h3 className="font-bold text-blue-950 flex items-center gap-2 mb-6"><BarChart2 size={20} /> {t('perf_cat')} ({currentYear})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div>
                <h4 className="text-sm font-black uppercase text-emerald-700 border-b-2 border-emerald-100 pb-2 mb-4">{t('incomes')}</h4>
                {categoryFlow.incomes.length === 0 ? <p className="text-sm text-gray-400 italic">{t('no_inc')}</p> : 
                  <ul className="space-y-3">{categoryFlow.incomes.map(([cat, val]) => (<li key={cat} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2"><span className="text-gray-700 font-medium">{cat}</span><span className="font-black text-emerald-600">{formatCurrency(val)}</span></li>))}</ul>
                }
             </div>
             <div>
                <h4 className="text-sm font-black uppercase text-red-700 border-b-2 border-red-100 pb-2 mb-4">{t('expenses')}</h4>
                {categoryFlow.expenses.length === 0 ? <p className="text-sm text-gray-400 italic">{t('no_exp')}</p> : 
                  <ul className="space-y-3">{categoryFlow.expenses.map(([cat, val]) => (<li key={cat} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2"><span className="text-gray-700 font-medium">{cat}</span><span className="font-black text-red-600">{formatCurrency(val)}</span></li>))}</ul>
                }
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LivroCaixa = ({ transactions, onAdd, onUpdate, onDelete }) => {
  const { triggerPrint, userRole, t, formatCurrency, showToast, lang } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [customCategory, setCustomCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const initialForm = { type: 'income', category: 'Mensalidades', description: '', amount: '', date: new Date().toISOString().split('T')[0] };
  const [formData, setFormData] = useState(initialForm);

  const categories = { income: ['Convidados', 'Mensalidades', 'Patrocínios', 'Venda de Produtos', 'Outras Receitas'], expense: ['Arbitragem', 'Medicamentos', 'Camisas e Coletes', 'Confraternizações', 'Água e Gelo', 'Materiais Esportivos', 'Taxa de Torneios', 'Locação de campo', 'Outras Despesas'] };

  const handleOpenModal = (tx = null) => {
    if (tx) {
      setEditingId(tx.id);
      const isCustom = !categories[tx.type].includes(tx.category || '');
      setFormData({ type: tx.type, category: isCustom ? (tx.type === 'income' ? 'Outras Receitas' : 'Outras Despesas') : tx.category, description: tx.description, amount: tx.amount, date: tx.date });
      setCustomCategory(isCustom ? tx.category : '');
    } else { setEditingId(null); setFormData(initialForm); setCustomCategory(''); }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.description || !formData.amount) return showToast(t('fill_fields'), 'error');
    const parsedAmount = parseFloat(formData.amount);
    if(isNaN(parsedAmount)) return showToast(t('invalid_val'), 'error');
    const finalCategory = (formData.category === 'Outras Receitas' || formData.category === 'Outras Despesas') && customCategory.trim() !== '' ? customCategory : formData.category;
    if (editingId) onUpdate(editingId, { ...formData, category: finalCategory, amount: parsedAmount });
    else onAdd({ ...formData, category: finalCategory, amount: parsedAmount, isRefunded: false });
    setIsModalOpen(false);
  };

  const filteredTransactions = (transactions || []).filter(tx => { 
    if(!tx.date) return false;
    const parts = tx.date.split('-');
    if(parts.length < 2) return false;
    return parseInt(parts[1], 10) === parseInt(filterMonth, 10) && parseInt(parts[0], 10) === parseInt(filterYear, 10); 
  }).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  
  const validTransactions = filteredTransactions.filter(tx => !tx.isRefunded);
  const totalIncome = validTransactions.filter(tx => tx.type === 'income').reduce((acc, tx) => acc + Number(tx.amount), 0);
  const totalExpense = validTransactions.filter(tx => tx.type === 'expense').reduce((acc, tx) => acc + Number(tx.amount), 0);

  const localeCode = lang === 'en' ? 'en-US' : (lang === 'pt-BR' ? 'pt-BR' : lang === 'es' ? 'es-ES' : 'fr-FR');

  return (
    <div className="space-y-4 fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow print:hidden">
        <div className="flex gap-2 w-full md:w-auto">
          <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="p-2 border rounded">{Array.from({length: 12}, (_, i) => (<option key={i+1} value={i+1}>{new Date(2024, i, 1).toLocaleString(localeCode, {month: 'long'})}</option>))}</select>
          <input type="number" value={filterYear} onChange={e => setFilterYear(e.target.value)} className="p-2 border rounded w-24" />
        </div>
        <div className="flex gap-2">
          <button onClick={triggerPrint} className="bg-slate-200 px-3 py-2 rounded flex gap-2 hover:bg-slate-300"><Printer size={18} /> {t('print')}</button>
          {userRole !== 'viewer' && <button onClick={() => handleOpenModal()} className="bg-emerald-700 text-white px-3 py-2 rounded flex gap-2 hover:bg-emerald-600 shadow-md"><Plus size={18} /> {t('new')}</button>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
         <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200 text-center shadow-sm"><p className="text-sm text-emerald-800">{t('cb_entries')}</p><p className="text-xl font-bold text-emerald-600">{formatCurrency(totalIncome)}</p></div>
         <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center shadow-sm"><p className="text-sm text-red-800">{t('cb_exits')}</p><p className="text-xl font-bold text-red-600">{formatCurrency(totalExpense)}</p></div>
         <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center shadow-sm"><p className="text-sm text-blue-800">{t('cb_month_bal')}</p><p className="text-xl font-bold text-blue-800">{formatCurrency(totalIncome - totalExpense)}</p></div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto print-area border border-gray-100">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 border-b"><tr><th className="p-3">{t('date')}</th><th className="p-3">{t('desc')}</th><th className="p-3">{t('cat')}</th><th className="p-3 text-right">{t('amount')}</th>{userRole !== 'viewer' && <th className="p-3 text-center print:hidden">{t('actions')}</th>}</tr></thead>
          <tbody>
            {validTransactions.map(tx => (
              <tr key={tx.id} className={`border-b ${tx.type === 'expense' ? 'bg-red-50/20' : 'hover:bg-slate-50'}`}>
                <td className="p-3 whitespace-nowrap">{tx.date ? new Date(tx.date + 'T12:00:00').toLocaleDateString(localeCode) : '-'}</td>
                <td className="p-3 font-medium text-slate-800">{tx.description || '-'}</td>
                <td className="p-3"><span className="text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-700 whitespace-nowrap">{tx.category || '-'}</span></td>
                <td className={`p-3 text-right font-bold whitespace-nowrap ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>{tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}</td>
                {userRole !== 'viewer' && (
                  <td className="p-3 text-center print:hidden flex justify-center gap-3">
                    <button onClick={() => handleOpenModal(tx)} className="text-blue-500 hover:text-blue-700 transition-colors"><Edit2 size={18} /></button>
                    <button onClick={() => setConfirmDeleteId(tx.id)} className="text-red-500 hover:text-red-700 transition-colors"><Trash2 size={18} /></button>
                  </td>
                )}
              </tr>
            ))}
            {validTransactions.length === 0 && (
              <tr><td colSpan={userRole === 'viewer' ? 4 : 5} className="p-8 text-center text-gray-400">Nenhum lançamento no período.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal isOpen={!!confirmDeleteId} title={t('del_tx')} message={t('del_tx_msg')} onConfirm={() => { onDelete(confirmDeleteId); setConfirmDeleteId(null); }} onCancel={() => setConfirmDeleteId(null)} />
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? t('edit_tx') : t('new_tx')}>
        <div className="space-y-4">
          <div className="flex gap-4 p-3 bg-gray-50 rounded-lg border">
            <label className="flex gap-2 items-center cursor-pointer font-medium text-emerald-700"><input type="radio" checked={formData.type === 'income'} onChange={() => setFormData({...formData, type: 'income', category: categories.income[0]})} className="accent-emerald-600 w-4 h-4" /> {t('revenue')}</label>
            <label className="flex gap-2 items-center cursor-pointer font-medium text-red-700"><input type="radio" checked={formData.type === 'expense'} onChange={() => setFormData({...formData, type: 'expense', category: categories.expense[0]})} className="accent-red-600 w-4 h-4" /> {t('expense')}</label>
          </div>
          <div><label className="block text-sm font-medium mb-1 text-gray-700">{t('date')}</label><input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
          <div><label className="block text-sm font-medium mb-1 text-gray-700">{t('desc')}</label><input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Ex: Pagamento Juiz" /></div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">{t('cat')}</label>
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white">{categories[formData.type].map(cat => <option key={cat} value={cat}>{cat}</option>)}</select>
            {(formData.category === 'Outras Receitas' || formData.category === 'Outras Despesas') && <input type="text" placeholder={t('what_cat')} value={customCategory} onChange={e => setCustomCategory(e.target.value)} className="w-full p-2.5 border rounded-lg mt-2 focus:ring-2 focus:ring-emerald-500 outline-none" />}
          </div>
          <div><label className="block text-sm font-medium mb-1 text-gray-700">{t('amount')} (R$)</label><input type="number" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="0.00" /></div>
          <button onClick={handleSave} className="w-full bg-emerald-700 text-white font-bold p-3.5 rounded-lg hover:bg-emerald-600 shadow-lg transition-colors mt-2">{t('save')}</button>
        </div>
      </Modal>
    </div>
  );
};

const Associados = ({ members, onSave, onDelete }) => {
  const { triggerPrint, userRole, t, showToast } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentMember, setCurrentMember] = useState(null);

  const defaultMember = { 
    name: '', birthDate: '', whatsapp: '', fee: 60.00, entryDate: new Date().toISOString().split('T')[0], 
    status: 'Ativo', photoBase64: '', jerseyNumber: '', position: 'Meia', secondaryPosition: 'NENHUMA',
    weight: 75, height: 1.75, speed: 'NORMAL', foot: 'DIREITO', strength: 'NORMAL', skill: 3, isPlaying: true 
  };

  const handleOpenModal = (member = null) => { setCurrentMember(member || defaultMember); setIsModalOpen(true); };
  
  const handleSave = () => { 
    if (!currentMember.name) return showToast(t('name_req'), 'error'); 
    onSave(currentMember); 
    setIsModalOpen(false); 
  };
  
  const filteredMembers = (members || [])
    .filter(m => (m.name || '').toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  return (
    <div className="space-y-4 fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow print:hidden">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input type="text" placeholder={t('assoc_search')} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50" />
        </div>
        <div className="flex flex-wrap justify-end gap-2 w-full md:w-auto">
          <button onClick={triggerPrint} className="bg-slate-200 text-slate-700 px-3 py-2 rounded-lg flex gap-2 items-center hover:bg-slate-300 font-medium text-sm transition-colors"><Printer size={16}/> {t('print')}</button>
          {userRole === 'admin' && <button onClick={() => handleOpenModal()} className="bg-emerald-700 text-white px-4 py-2 rounded-lg flex gap-2 items-center hover:bg-emerald-600 font-bold shadow-md transition-colors"><Plus size={18} /> {t('new')}</button>}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto print-area border border-gray-100">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-600 border-b">
            <tr>
              <th className="p-3 w-16 text-center">{t('photo')}</th>
              <th className="p-3">{t('name')}</th>
              <th className="p-3 text-center">{t('overall')}</th>
              <th className="p-3 text-center"><Shirt size={16} className="inline"/></th>
              <th className="p-3">{t('pos')}</th>
              <th className="p-3 text-center">{t('status')}</th>
              {userRole === 'admin' && <th className="p-3 text-center print:hidden">{t('actions')}</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredMembers.map(m => {
              const ovr = calcularOverall(m);
              return (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 text-center">
                    {m.photoBase64 ? <img src={m.photoBase64} alt={m.name} className="w-10 h-10 rounded-full object-cover border mx-auto shadow-sm" /> : <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mx-auto">{(m.name || 'U').charAt(0).toUpperCase()}</div>}
                  </td>
                  <td className="p-3 font-bold text-slate-800">{m.name || '-'}</td>
                  <td className="p-3 text-center">
                    <span className="bg-gradient-to-br from-blue-500 to-blue-700 text-white px-2.5 py-1 rounded shadow-inner text-xs font-black">{ovr}</span>
                  </td>
                  <td className="p-3 text-center font-bold text-gray-500">{m.jerseyNumber || '-'}</td>
                  <td className="p-3 text-gray-600 font-medium">
                    {t(`pos_${(m.position || 'MEIA').toLowerCase().substring(0,3)}`) || m.position}
                    {m.secondaryPosition && m.secondaryPosition !== 'NENHUMA' && <span className="text-gray-400 text-xs ml-1">/ {t(`pos_${(m.secondaryPosition).toLowerCase().substring(0,3)}`) || m.secondaryPosition}</span>}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${m.status === 'Ativo' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{m.status === 'Ativo' ? t('active') : t('inactive')}</span>
                  </td>
                  {userRole === 'admin' && (
                    <td className="p-3 text-center print:hidden">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => handleOpenModal(m)} className="text-blue-500 hover:text-blue-700 transition-colors bg-blue-50 p-1.5 rounded"><Edit2 size={16} /></button>
                        <button onClick={() => setConfirmDeleteId(m.id)} className="text-red-500 hover:text-red-700 transition-colors bg-red-50 p-1.5 rounded"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  )}
                </tr>
              )
            })}
            {filteredMembers.length === 0 && (<tr><td colSpan={userRole === 'admin' ? 7 : 6} className="p-8 text-center text-gray-400">Nenhum associado encontrado.</td></tr>)}
          </tbody>
        </table>
      </div>

      <ConfirmModal isOpen={!!confirmDeleteId} title={t('del_tx')} message={t('del_tx_msg')} onConfirm={() => { onDelete(confirmDeleteId); setConfirmDeleteId(null); }} onCancel={() => setConfirmDeleteId(null)} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentMember?.id ? t('update') : t('new')}>
        {currentMember && (
          <div className="space-y-5">
            <ImageUploader label={t('prof_pic')} currentImage={currentMember.photoBase64} onImageChange={(img) => setCurrentMember({...currentMember, photoBase64: img})} />
            
            <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('full_name')}</label><input type="text" value={currentMember.name || ''} onChange={e => setCurrentMember({...currentMember, name: e.target.value})} className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
            
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('shirt_num')}</label><input type="number" value={currentMember.jerseyNumber || ''} onChange={e => setCurrentMember({...currentMember, jerseyNumber: e.target.value})} className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
              <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('whatsapp')}</label><input type="text" value={currentMember.whatsapp || ''} onChange={e => setCurrentMember({...currentMember, whatsapp: e.target.value})} className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('pos')}</label>
                <select value={currentMember.position || 'Meia'} onChange={e => setCurrentMember({...currentMember, position: e.target.value})} className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none">
                  <option value="Goleiro">{t('gk')}</option><option value="Zagueiro">{t('def')}</option><option value="Lateral">{t('lb')}</option><option value="Meia">{t('mid')}</option><option value="Atacante">{t('atk')}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('lbl_pos2')}</label>
                <select value={currentMember.secondaryPosition || 'NENHUMA'} onChange={e => setCurrentMember({...currentMember, secondaryPosition: e.target.value})} className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none">
                  <option value="NENHUMA">{t('none')}</option><option value="Goleiro">{t('gk')}</option><option value="Zagueiro">{t('def')}</option><option value="Lateral">{t('lb')}</option><option value="Meia">{t('mid')}</option><option value="Atacante">{t('atk')}</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
              <h4 className="text-sm font-black text-slate-700 mb-3 uppercase tracking-wider flex items-center gap-2"><Activity size={16}/> Atributos Físicos</h4>
              <div className="grid grid-cols-3 gap-3 mb-4">
                 <div><label className="block text-xs font-bold text-gray-500 mb-1">{t('birth')}</label><input type="date" value={currentMember.birthDate || ''} onChange={e => setCurrentMember({...currentMember, birthDate: e.target.value})} className="w-full p-2 border rounded-md text-sm outline-none" /></div>
                 <div><label className="block text-xs font-bold text-gray-500 mb-1">{t('lbl_weight')}</label><input type="number" value={currentMember.weight || 75} onChange={e => setCurrentMember({...currentMember, weight: parseFloat(e.target.value)})} className="w-full p-2 border rounded-md text-sm outline-none" /></div>
                 <div><label className="block text-xs font-bold text-gray-500 mb-1">{t('lbl_height')}</label><input type="number" step="0.01" value={currentMember.height || 1.75} onChange={e => setCurrentMember({...currentMember, height: parseFloat(e.target.value)})} className="w-full p-2 border rounded-md text-sm outline-none" /></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 flex items-center gap-1"><Zap size={12}/> {t('lbl_speed')}</label>
                    <select value={currentMember.speed || 'NORMAL'} onChange={e => setCurrentMember({...currentMember, speed: e.target.value})} className="w-full p-2 border rounded-md text-xs outline-none bg-white">
                      <option value="BAIXO">{t('vel_low')}</option><option value="NORMAL">{t('vel_nor')}</option><option value="RAPIDO">{t('vel_fast')}</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t('lbl_foot')}</label>
                    <select value={currentMember.foot || 'DIREITO'} onChange={e => setCurrentMember({...currentMember, foot: e.target.value})} className="w-full p-2 border rounded-md text-xs outline-none bg-white">
                      <option value="DIREITO">{t('foot_r')}</option><option value="ESQUERDO">{t('foot_l')}</option><option value="AMBOS">{t('foot_b')}</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 flex items-center gap-1"><Shield size={12}/> {t('lbl_strength')}</label>
                    <select value={currentMember.strength || 'NORMAL'} onChange={e => setCurrentMember({...currentMember, strength: e.target.value})} className="w-full p-2 border rounded-md text-xs outline-none bg-white">
                      <option value="LEVE">{t('str_light')}</option><option value="NORMAL">{t('str_nor')}</option><option value="FORTE">{t('str_strong')}</option>
                    </select>
                 </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200">
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">{t('lbl_skill')}</label>
                <StarRating value={currentMember.skill || 3} onChange={(val) => setCurrentMember({...currentMember, skill: val})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('entry_date')}</label><input type="date" value={currentMember.entryDate || ''} onChange={e => setCurrentMember({...currentMember, entryDate: e.target.value})} className="w-full p-2.5 border rounded-lg bg-gray-50 outline-none" /></div>
               <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('fee')}</label><input type="number" step="0.01" value={currentMember.fee || 0} onChange={e => setCurrentMember({...currentMember, fee: e.target.value})} className="w-full p-2.5 border rounded-lg bg-gray-50 outline-none" /></div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('status')} (Financeiro)</label>
              <select value={currentMember.status || 'Ativo'} onChange={e => setCurrentMember({...currentMember, status: e.target.value})} className="w-full p-2.5 border rounded-lg bg-gray-50 outline-none font-bold">
                <option value="Ativo">{t('active')}</option><option value="Inativo">{t('inactive')}</option>
              </select>
            </div>

            <button onClick={handleSave} className="w-full bg-emerald-700 text-white font-bold p-4 rounded-xl shadow-lg hover:bg-emerald-600 transition-colors text-lg mt-2">{t('save')}</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

const ListaPresenca = ({ members, onSave, onResetMatch }) => {
  const { t } = useAppContext();
  const [confirmReset, setConfirmReset] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const togglePlayStatus = (member) => {
    onSave({ ...member, isPlaying: !member.isPlaying });
  };

  const filteredMembers = (members || [])
    .filter(m => m.status === 'Ativo') // Only active members can play
    .filter(m => (m.name || '').toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  return (
    <div className="space-y-4 fade-in max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input type="text" placeholder={t('assoc_search')} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50" />
        </div>
        <button onClick={() => setConfirmReset(true)} className="bg-orange-100 text-orange-800 border border-orange-200 px-4 py-2 rounded-lg flex gap-2 items-center hover:bg-orange-200 font-bold shadow-sm transition-colors w-full md:w-auto justify-center"><RotateCcw size={18}/> {t('deselect_all')}</button>
      </div>

      <div className="space-y-3 pb-10">
        {filteredMembers.map(m => {
          const ovr = calcularOverall(m);
          const anoNasc = m.birthDate ? parseInt(m.birthDate.split('-')[0], 10) : null;
          const idade = anoNasc ? new Date().getFullYear() - anoNasc : '--';
          const imc = calcularIMC(m.weight, m.height);
          
          return (
            <div key={m.id} className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${m.isPlaying ? 'bg-white border-emerald-500 shadow-md' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}>
              <div className="flex items-center gap-4 flex-1">
                {m.photoBase64 ? <img src={m.photoBase64} alt={m.name} className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-200" /> : <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-black shadow-sm text-lg border border-slate-300">{(m.name || 'U').charAt(0).toUpperCase()}</div>}
                <div>
                  <h3 className={`font-black text-lg uppercase tracking-tight leading-none mb-1 ${m.isPlaying ? 'text-yellow-600 drop-shadow-sm' : 'text-gray-500'}`}>{m.name}</h3>
                  <div className="flex items-center gap-2 text-xs font-bold flex-wrap">
                    <span className="text-gray-400">{m.position}</span>
                    <span className="text-gray-400 border-l border-gray-300 pl-2">{t('age')}: {idade}</span>
                    <span className="text-gray-400 border-l border-gray-300 pl-2">IMC: {imc}</span>
                    <span className="bg-gradient-to-br from-blue-500 to-blue-700 text-white px-1.5 py-0.5 rounded shadow-inner tracking-wider ml-1">OVR {ovr}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => togglePlayStatus(m)} className={`shrink-0 w-32 py-2.5 rounded-lg font-black text-sm uppercase flex justify-center items-center gap-1.5 transition-colors shadow-sm ${m.isPlaying ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}>
                {m.isPlaying ? <CheckCircle size={16} /> : <X size={16} />}
                {m.isPlaying ? t('playing') : t('not_playing')}
              </button>
            </div>
          )
        })}
        {filteredMembers.length === 0 && (<div className="p-8 text-center text-gray-400 font-bold bg-white rounded-xl shadow">Nenhum associado ativo encontrado.</div>)}
      </div>

      <ConfirmModal isOpen={confirmReset} title={t('deselect_all')} message={t('reset_msg')} onConfirm={() => { onResetMatch(); setConfirmReset(false); }} onCancel={() => setConfirmReset(false)} />
    </div>
  );
};

const Sorteio = ({ members }) => {
  const { t, showToast } = useAppContext();
  const [numTeams, setNumTeams] = useState(2);
  const [teams, setTeams] = useState([]);
  const [aiReview, setAiReview] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  const teamColors = [
    { bg: 'bg-blue-600', border: 'border-blue-500', badge: 'bg-blue-800' },
    { bg: 'bg-yellow-500', border: 'border-yellow-500', badge: 'bg-yellow-700', text: 'text-gray-900' },
    { bg: 'bg-emerald-600', border: 'border-emerald-500', badge: 'bg-emerald-800' },
    { bg: 'bg-red-600', border: 'border-red-500', badge: 'bg-red-800' },
    { bg: 'bg-orange-600', border: 'border-orange-500', badge: 'bg-orange-800' },
    { bg: 'bg-purple-600', border: 'border-purple-500', badge: 'bg-purple-800' },
    { bg: 'bg-pink-600', border: 'border-pink-500', badge: 'bg-pink-800' },
    { bg: 'bg-gray-600', border: 'border-gray-500', badge: 'bg-gray-800' }
  ];

  const handleDraw = () => {
    const playing = members.filter(m => m.isPlaying && m.status === 'Ativo');
    if (playing.length < numTeams) {
      showToast(t('draw_err').replace('{num}', numTeams), 'error');
      return;
    }

    const generated = Array.from({ length: numTeams }, (_, i) => ({
      id: i,
      name: `${t('team')} ${i + 1}`,
      color: teamColors[i % teamColors.length],
      players: [],
      totalForce: 0
    }));

    const groups = { 'Goleiro': [], 'Zagueiro': [], 'Lateral': [], 'Meia': [], 'Atacante': [] };
    playing.forEach(p => {
      const pos = p.position || 'Meia';
      if (groups[pos]) groups[pos].push(p);
      else groups['Atacante'].push(p);
    });

    for (const pos in groups) {
      groups[pos].sort((a, b) => calcularOverall(b) - calcularOverall(a));

      groups[pos].forEach(player => {
        const pts = calcularOverall(player);
        let targetTeam = null;
        let minPlayers = Infinity;
        let minForce = Infinity;

        generated.forEach(team => {
          if (team.players.length < minPlayers) {
            minPlayers = team.players.length;
            minForce = team.totalForce;
            targetTeam = team;
          } else if (team.players.length === minPlayers) {
            if (team.totalForce < minForce) {
              minForce = team.totalForce;
              targetTeam = team;
            }
          }
        });

        if (targetTeam) {
          targetTeam.players.push(player);
          targetTeam.totalForce += pts;
        }
      });
    }

    const posOrder = { 'Goleiro': 1, 'Zagueiro': 2, 'Lateral': 3, 'Meia': 4, 'Atacante': 5 };
    generated.forEach(team => {
      team.players.sort((a, b) => (posOrder[a.position] || 9) - (posOrder[b.position] || 9));
    });

    setTeams(generated);
    setAiReview('');
    showToast(t('draw_succ'));
  };

  const getAiReview = () => {
    setLoadingAi(true);
    setAiReview('');
    setTimeout(() => {
      const msgs = [t('ai_1'), t('ai_2'), t('ai_3')];
      setAiReview(`🎙️ Nuno IA: ${msgs[Math.floor(Math.random() * msgs.length)]}`);
      setLoadingAi(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 fade-in max-w-4xl mx-auto">
      <div className="bg-slate-800 text-white rounded-2xl p-6 shadow-xl border border-slate-700 text-center relative overflow-hidden">
        <Swords className="absolute -top-4 -right-4 text-slate-700 opacity-20" size={120} />
        <h2 className="text-2xl font-black mb-4 flex items-center justify-center gap-3 relative z-10"><Trophy className="text-yellow-400"/> {t('draw_title')}</h2>
        
        <div className="bg-slate-900 border border-slate-600 rounded-xl p-5 mb-4 flex items-center justify-between text-left shadow-inner max-w-sm mx-auto relative z-10">
          <label className="text-sm font-bold text-gray-300 uppercase tracking-wider">{t('draw_num')}</label>
          <div className="flex items-center gap-4">
            <input type="range" min="2" max="8" value={numTeams} onChange={(e) => setNumTeams(parseInt(e.target.value))} className="w-24 accent-emerald-500 cursor-pointer" />
            <div className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-center min-w-[3rem] shadow">
              <span className="text-xl font-black text-emerald-400">{numTeams}</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-6 max-w-md mx-auto relative z-10">{t('draw_desc')}</p>
        
        <div className="flex gap-4 justify-center relative z-10">
          {teams.length > 0 && (
            <button onClick={handleDraw} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-xl transition shadow flex items-center gap-2"><RotateCcw size={18} /> {t('redraw_btn')}</button>
          )}
          <button onClick={handleDraw} className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black py-3 px-8 rounded-xl transition shadow-lg flex items-center gap-2"><Swords size={20} /> {t('draw_btn')}</button>
        </div>
      </div>

      {teams.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teams.map((team, idx) => {
              const currentYear = new Date().getFullYear();
              let sumAge = 0; let sumBmi = 0;
              team.players.forEach(p => {
                const y = p.birthDate ? parseInt(p.birthDate.split('-')[0], 10) : NaN;
                sumAge += !isNaN(y) ? (currentYear - y) : 30;
                sumBmi += calcularIMC(p.weight, p.height);
              });
              const avgAge = team.players.length ? (sumAge / team.players.length).toFixed(1) : 0;
              const avgBmi = team.players.length ? (sumBmi / team.players.length).toFixed(1) : 0;

              return (
                <div key={team.id} className={`bg-white rounded-2xl overflow-hidden border-2 ${team.color.border} shadow-lg transition-transform hover:-translate-y-1`}>
                  <div className={`${team.color.bg} ${team.color.text || 'text-white'} px-5 py-3 flex justify-between items-center`}>
                    <h3 className="font-black text-lg flex items-center gap-2 uppercase tracking-wide"><Shirt size={20}/> {team.name}</h3>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold mb-0.5 opacity-90">{team.players.length} {t('player')}s</span>
                      <span className={`${team.color.badge} text-white text-[11px] px-2 py-0.5 rounded shadow-inner font-mono font-bold tracking-widest`}>OVR: {team.totalForce}</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 px-5 py-2 flex justify-between text-[11px] text-slate-500 border-b border-slate-100 font-bold uppercase tracking-wider">
                    <span>{t('avg_age')}: {avgAge}</span>
                    <span>{t('avg_bmi')}: {avgBmi}</span>
                  </div>
                  <ul className="divide-y divide-slate-100 p-2">
                    {team.players.map(p => (
                      <li key={p.id} className="p-3 flex justify-between items-center hover:bg-slate-50 rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${team.color.badge} text-white flex items-center justify-center font-black shadow text-sm shrink-0`}>
                            {p.jerseyNumber || (p.name?.[0]?.toUpperCase()) || '-'}
                          </div>
                          <div>
                            <p className="text-slate-800 font-extrabold uppercase text-sm leading-tight">{p.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">{p.position}</p>
                          </div>
                        </div>
                        <span className="bg-gradient-to-br from-blue-500 to-blue-700 text-white px-2 py-1 rounded shadow-inner text-xs font-black shrink-0">{calcularOverall(p)}</span>
                      </li>
                    ))}
                    {team.players.length === 0 && <li className="text-xs text-gray-400 p-4 text-center">Sem jogadores</li>}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button onClick={getAiReview} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 px-6 rounded-xl transition shadow-lg flex items-center justify-center gap-3 text-lg">
              <Bot size={24} className={loadingAi ? 'animate-bounce' : ''} /> {t('ai_btn')}
            </button>
            {aiReview && (
              <div className="bg-slate-900 border border-purple-500/50 rounded-xl p-5 text-purple-200 mt-4 italic font-medium shadow-inner animate-fade-in text-center text-lg">
                {aiReview}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const Mensalidades = ({ members, payments, onSavePayment, onAddTransaction, onRefundPayment }) => {
  const { triggerPrint, userRole, t, formatCurrency, showToast, lang } = useAppContext();
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionModalData, setActionModalData] = useState(null);
  const [confirmEstorno, setConfirmEstorno] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const meses = [
    { id: '1', label: 'Jan' }, { id: '2', label: 'Fev' }, { id: '3', label: 'Mar' },
    { id: '4', label: 'Abr' }, { id: '5', label: 'Mai' }, { id: '6', label: 'Jun' },
    { id: '7', label: 'Jul' }, { id: '8', label: 'Ago' }, { id: '9', label: 'Set' },
    { id: '10', label: 'Out' }, { id: '11', label: 'Nov' }, { id: '12', label: 'Dez' }
  ];
  
  const activeSortedMembers = useMemo(() => (members || []).filter(m => m.status === 'Ativo').sort((a, b) => (a.name||'').localeCompare(b.name||'')), [members]);

  const currentRealYear = new Date().getFullYear();
  const currentRealMonth = new Date().getMonth() + 1;

  const countDelayedPeriods = (member) => {
    let count = 0;
    for (let m = 1; m <= 12; m++) {
      if (!checkValidPeriod(member, year, m.toString())) continue;
      const isPastOrCurrent = year < currentRealYear || (year === currentRealYear && m <= currentRealMonth);
      if (isPastOrCurrent) {
        const hasPaid = (payments || []).some(p => p.memberId === member.id && p.periodId === m.toString() && p.year === year.toString());
        if (!hasPaid) count++;
      }
    }
    return count;
  };

  const handleCellClick = (member, month) => {
    if (userRole === 'viewer') return;
    if (!checkValidPeriod(member, year, month.id)) return; 
    
    const existingPayment = (payments || []).find(p => p.memberId === member.id && p.periodId === month.id && p.year === year.toString());
    if (existingPayment) {
      setActionModalData({ member, month, payment: existingPayment });
    } else { 
      setSelectedPayment({ memberId: member.id, memberName: member.name, periodId: month.id, periodLabel: month.label, year: year.toString(), amount: member.fee || 60, date: new Date().toISOString().split('T')[0] }); 
      setIsModalOpen(true); 
    }
  };

  const handleSave = () => {
    const amount = parseFloat(selectedPayment.amount);
    if(isNaN(amount) || amount <= 0) return showToast(t('invalid_val'), 'error');
    onSavePayment({ ...selectedPayment, amount });
    onAddTransaction({ type: 'income', category: 'Mensalidades', description: `Mensalidade ${selectedPayment.periodLabel}/${year} - ${selectedPayment.memberName}`, amount: amount, date: selectedPayment.date, isRefunded: false });
    showToast(t('pay_success'), 'success'); 
    setIsModalOpen(false);
    setReceiptData({ ...selectedPayment, amount, date: new Date().toISOString() });
  };

  const handleCopyReceipt = () => {
    if (!receiptData) return;
    const localeCode = lang === 'en' ? 'en-US' : (lang === 'pt-BR' ? 'pt-BR' : lang === 'es' ? 'es-ES' : 'fr-FR');
    const text = `🧾 *${t('receipt').toUpperCase()}* 🧾\n\n👤 *${t('assoc_search').replace('...', '')}:* ${receiptData.memberName}\n🗓️ *${t('ref')}* Mensalidade ${receiptData.periodLabel}/${receiptData.year}\n💰 *${t('paid_val')}* ${formatCurrency(receiptData.amount)}\n📅 *${t('date')}:* ${new Date(receiptData.date).toLocaleDateString(localeCode)}\n\n✅ _Pagamento confirmado! Obrigado por fortalecer nosso grupo!_ ⚽`;
    const member = (members || []).find(m => m.id === receiptData.memberId);
    if (member && member.whatsapp) { safeWhatsAppOpen(member.whatsapp, text); showToast(t('wpp_opened'), 'success'); } 
    else { navigator.clipboard.writeText(text); showToast(t('wpp_no_num'), 'success'); }
  };

  return (
    <div className="space-y-4 fade-in">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow print:hidden">
        <h2 className="text-xl font-bold flex items-center gap-2 text-emerald-800"><Calendar size={22}/> {t('month_ctrl')} {year}</h2>
        <div className="flex gap-4 items-center">
          <div className="flex gap-1">
            <button onClick={() => setYear(y => y - 1)} className="p-2 border rounded-l-lg hover:bg-gray-100 transition-colors">&lt;</button>
            <div className="p-2 border-y px-4 font-bold bg-gray-50">{year}</div>
            <button onClick={() => setYear(y => y + 1)} className="p-2 border rounded-r-lg hover:bg-gray-100 transition-colors">&gt;</button>
          </div>
          <button onClick={triggerPrint} className="bg-slate-200 px-3 py-2 rounded-lg flex gap-2 hover:bg-slate-300 transition-colors"><Printer size={18} /> {t('print')}</button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow overflow-x-auto print-area border border-gray-100">
        <table className="w-full text-left text-sm">
          <thead className="bg-emerald-900 text-yellow-400">
            <tr>
               <th className="p-3 border-r border-emerald-800/50">{t('name')}</th>
               {meses.map(m => <th key={m.id} className="p-3 border-r border-emerald-800/50 text-center uppercase text-xs">{m.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {activeSortedMembers.map(m => {
              const delayCount = countDelayedPeriods(m);
              let badgeClass = "flex items-center justify-between gap-2 px-3 py-2 rounded-md w-full whitespace-nowrap transition-colors ";
              let iconColor = "text-white";
              if (delayCount >= 2) { badgeClass += "bg-black text-white shadow-md border border-gray-800"; iconColor = "text-red-500"; } 
              else if (delayCount === 1) { badgeClass += "bg-red-600 text-white shadow-md border border-red-700"; } 
              else { badgeClass += "bg-emerald-100 text-emerald-800 shadow-md border border-emerald-300"; }
              
              return (
                <tr key={m.id} className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                  <td className="p-2 border-r border-gray-100 min-w-[220px]">
                    <div className={badgeClass}>
                      <span className="font-bold text-sm uppercase tracking-tight truncate">{m.name}</span>
                      {delayCount >= 1 && (<div className="flex items-center gap-1 shrink-0"><span className="text-xs font-bold px-1.5 py-0.5 rounded bg-white/20">{delayCount}</span><AlertTriangle size={16} className={`${iconColor} animate-pulse`} /></div>)}
                    </div>
                  </td>
                  {meses.map(month => {
                    if (!checkValidPeriod(m, year, month.id)) return <td key={month.id} className="p-1 border-r border-gray-100 text-center bg-gray-50"><div className="text-gray-300 text-xs p-2 font-medium">N/A</div></td>;
                    const pay = (payments || []).find(p => p.memberId === m.id && p.periodId === month.id && p.year === year.toString());
                    return (
                      <td key={month.id} className="p-1 border-r border-gray-100 text-center cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleCellClick(m, month)}>
                        {pay ? <div className="bg-emerald-100 text-emerald-800 p-2 rounded text-xs font-bold shadow-sm">{formatCurrency(pay.amount)}</div> : <div className="bg-slate-100 text-slate-400 p-2 rounded text-[10px] font-bold uppercase tracking-wider">{t('pending')}</div>}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {activeSortedMembers.length === 0 && <tr><td colSpan={13} className="p-6 text-center text-gray-400">Nenhum sócio ativo.</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('receive_from')}>
        {selectedPayment && (
          <div className="space-y-4">
            <p className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg font-medium">{t('receive_from')} <strong className="text-blue-900">{selectedPayment.memberName}</strong> <br/><span className="text-sm opacity-80">Referência: {selectedPayment.periodLabel}/{year}</span></p>
            <div><label className="block text-sm font-bold text-gray-600 mb-1">{t('amount')} (R$)</label><input type="number" step="0.01" value={selectedPayment.amount} onChange={e => setSelectedPayment({...selectedPayment, amount: e.target.value})} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-lg font-black text-emerald-700" /></div>
            <button onClick={handleSave} className="w-full bg-emerald-700 text-white p-4 rounded-lg font-black shadow-lg hover:bg-emerald-600 transition-colors text-lg mt-2">{t('confirm')}</button>
          </div>
        )}
      </Modal>
      
      {userRole !== 'viewer' && (
        <>
          <Modal isOpen={!!actionModalData && !confirmEstorno} onClose={() => setActionModalData(null)} title={t('options')}>
            {actionModalData && (
              <div className="space-y-4">
                <button onClick={() => setConfirmEstorno(true)} className="w-full bg-orange-500 hover:bg-orange-600 transition-colors text-white p-4 rounded-xl flex justify-center gap-2 font-bold shadow"><RotateCcw size={20} /> {t('refund')}</button>
              </div>
            )}
          </Modal>
          <ConfirmModal isOpen={confirmEstorno} title={t('refund')} message={t('refund_msg')} onConfirm={() => { onRefundPayment(actionModalData.payment.id, `Mensalidade ${actionModalData.month.label}/${actionModalData.payment.year} - ${actionModalData.member.name}`); setConfirmEstorno(false); setActionModalData(null); }} onCancel={() => setConfirmEstorno(false)} />
        </>
      )}

      <Modal isOpen={!!receiptData} onClose={() => setReceiptData(null)} title={t('receipt')}>
        {receiptData && (
          <div className="space-y-6 flex flex-col items-center">
             <div className="w-full bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 text-center shadow-sm">
                 <CheckCircle className="text-emerald-500 mx-auto mb-4" size={48} />
                 <h3 className="font-black text-2xl text-blue-950 uppercase tracking-widest mb-1">{t('receipt')}</h3>
                 <p className="text-sm text-gray-500 mb-6 font-medium">{new Date(receiptData.date).toLocaleDateString(lang === 'en' ? 'en-US' : (lang === 'pt-BR' ? 'pt-BR' : lang === 'es' ? 'es-ES' : 'fr-FR'))}</p>
                 <div className="flex justify-between border-b border-gray-100 py-3 text-sm"><span className="text-gray-500 uppercase font-bold tracking-wider">{t('assoc_search').replace('...', '')}:</span><span className="font-black text-slate-800">{receiptData.memberName}</span></div>
                 <div className="flex justify-between border-b border-gray-100 py-3 text-sm"><span className="text-gray-500 uppercase font-bold tracking-wider">{t('ref')}</span><span className="font-black text-slate-800">Mensalidade {receiptData.periodLabel}/{receiptData.year}</span></div>
                 <div className="flex justify-between py-4 text-base"><span className="text-gray-500 uppercase font-bold tracking-wider">{t('paid_val')}</span><span className="font-black text-emerald-600 text-xl">{formatCurrency(receiptData.amount)}</span></div>
             </div>
             <div className="w-full flex gap-3 mt-2">
              <button onClick={() => setReceiptData(null)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold p-3.5 rounded-xl transition-colors">{t('close')}</button>
              {userRole !== 'viewer' && (<button onClick={handleCopyReceipt} className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white font-black p-3.5 rounded-xl flex justify-center items-center gap-2 transition-colors shadow"><Copy size={18} /> {t('copy_wpp')}</button>)}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const Inadimplentes = ({ members, payments }) => {
  const { triggerPrint, userRole, t, formatCurrency, showToast } = useAppContext();
  const currentYear = new Date().getFullYear().toString();
  const currentMonth = new Date().getMonth() + 1;

  const defaulters = useMemo(() => {
    let list = [];
    (members || []).filter(m => m.status === 'Ativo').forEach(member => {
      let owedPeriods = []; let totalOwed = 0;
      for (let i = 1; i <= currentMonth; i++) {
        if (checkValidPeriod(member, currentYear, i.toString())) {
          if (!(payments || []).some(p => p.memberId === member.id && p.periodId === i.toString() && p.year === currentYear)) {
            owedPeriods.push(['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][i-1]);
            totalOwed += Number(member.fee || 60);
          }
        }
      }
      if (owedPeriods.length > 0) list.push({ ...member, owedPeriods, totalOwed });
    });
    return list.sort((a, b) => (a.name||'').localeCompare(b.name||''));
  }, [members, payments, currentMonth, currentYear]);

  const handleGroupCopy = () => {
    if (defaulters.length === 0) return showToast(t('no_def'), 'error');
    let text = `⚽ *Agremiação* ⚽\n\nOlá pessoal! Resumo de mensalidades pendentes:\n\n`;
    defaulters.forEach(d => { text += `👤 *${d.name}*\n🗓️ ${t('pend_per')}: ${d.owedPeriods.join(', ')}\n💰 ${t('total')}: ${formatCurrency(d.totalOwed)}\n\n`; });
    try { navigator.clipboard.writeText(text).then(() => showToast(t('rep_copied'), 'success')); } catch(e){}
  };

  return (
    <div className="space-y-4 fade-in">
      <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center print:hidden flex-wrap gap-2">
        <h2 className="text-xl font-black text-red-700 flex items-center gap-2"><AlertTriangle size={22}/> {t('def_rep')}</h2>
        <div className="flex gap-2">
          <button onClick={handleGroupCopy} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex gap-2 font-bold shadow transition-colors"><Copy size={18} /> {t('copy_all')}</button>
          <button onClick={triggerPrint} className="bg-slate-200 hover:bg-slate-300 px-4 py-2 rounded-lg flex gap-2 transition-colors font-medium text-slate-700"><Printer size={18} /> {t('print')}</button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow overflow-hidden print-area border border-gray-100">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b text-slate-600"><tr><th className="p-3">{t('name')}</th><th className="p-3">{t('pend_per')}</th><th className="p-3 text-red-600 font-bold">{t('total')}</th>{userRole !== 'viewer' && <th className="p-3 text-center print:hidden">{t('action')}</th>}</tr></thead>
          <tbody className="divide-y divide-gray-100">
            {defaulters.length === 0 ? (
              <tr><td colSpan={userRole !== 'viewer' ? "4" : "3"} className="p-8 text-center text-emerald-600 font-black text-lg"><CheckCircle className="inline mb-1 mr-2" size={24}/> {t('all_good')}</td></tr>
            ) : (
              defaulters.map(d => (
                <tr key={d.id} className="hover:bg-red-50/30 transition-colors">
                  <td className="p-3 font-bold text-slate-800">{d.name}</td><td className="p-3 text-gray-500 font-medium">{d.owedPeriods.join(', ')}</td><td className="p-3 text-red-600 font-black">{formatCurrency(d.totalOwed)}</td>
                  {userRole !== 'viewer' && (
                    <td className="p-3 text-center print:hidden flex justify-center gap-2"><button onClick={() => safeWhatsAppOpen(d.whatsapp, `Olá, ${d.name}. Constatamos mensalidades pendentes (${d.owedPeriods.join(', ')}).`)} className="bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-1.5 rounded-lg flex gap-1 items-center text-xs font-bold shadow-sm transition-colors" disabled={!d.whatsapp}><MessageCircle size={14} /> WhatsApp</button></td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Aniversariantes = ({ members, settings }) => {
  const { userRole, t, lang } = useAppContext();
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);

  const birthdays = useMemo(() => {
    return (members || []).filter(m => m.status === 'Ativo' && m.birthDate).filter(m => {
      const parts = m.birthDate.split('-');
      return parts.length >= 2 && parseInt(parts[1], 10) === parseInt(filterMonth, 10);
    }).map(member => { 
      const parts = member.birthDate.split('-'); 
      const y = parseInt(parts[0], 10);
      const d = parts[2] ? parts[2].substring(0, 2) : '01';
      return { ...member, day: d, age: new Date().getFullYear() - y }; 
    }).sort((a, b) => parseInt(a.day, 10) - parseInt(b.day, 10));
  }, [members, filterMonth]);

  const localeCode = lang === 'en' ? 'en-US' : (lang === 'pt-BR' ? 'pt-BR' : lang === 'es' ? 'es-ES' : 'fr-FR');

  return (
    <div className="space-y-4 fade-in">
      <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center border border-gray-100">
        <h2 className="text-xl font-black flex items-center gap-2 text-blue-950"><Gift className="text-emerald-500" size={24}/> {t('nav_birthdays')}</h2>
        <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="p-2.5 border border-slate-200 bg-slate-50 rounded-lg font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm">{Array.from({length: 12}, (_, i) => (<option key={i+1} value={i+1}>{new Date(2024, i, 1).toLocaleString(localeCode, {month: 'long'})}</option>))}</select>
      </div>
      {birthdays.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center text-gray-400 font-bold border border-gray-100 text-lg">{t('bday_none')}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {birthdays.map(b => (
              <div key={b.id} className="relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border border-yellow-600/50 p-5 shadow-xl flex flex-col items-center transition-transform hover:-translate-y-2">
                <div className="w-full flex justify-between items-start z-10 mb-2">
                  <div className="text-4xl font-black text-yellow-500 drop-shadow-md italic">{b.jerseyNumber || '-'}</div>
                  <div className="w-10 h-10 flex-shrink-0 shadow-lg rounded-full overflow-hidden border border-yellow-500/30">{settings?.logoUrl ? <img src={settings.logoUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-700 flex items-center justify-center text-sm font-bold text-white">{settings?.clubName?.charAt(0) || 'C'}</div>}</div>
                </div>
                <div className="mb-4 flex flex-col items-center z-10 w-full">
                  <div className="w-28 h-28 border-[3px] border-yellow-500 bg-slate-800 overflow-hidden shadow-xl mb-3 rounded-xl">{b.photoBase64 ? <img src={b.photoBase64} className="w-full h-full object-cover" /> : <Users className="w-full h-full p-5 text-slate-500 bg-slate-200" />}</div>
                  <h3 className="text-lg font-black text-white text-center uppercase leading-tight line-clamp-2">{b.name}</h3>
                  <p className="text-[10px] text-yellow-400 uppercase font-black mt-1 tracking-widest bg-yellow-500/10 px-2 py-0.5 rounded-full">{b.position || t('player')}</p>
                </div>
                <div className="w-full flex justify-between items-end border-t border-slate-700/50 pt-3 mt-auto relative z-10">
                   <div className="flex flex-col"><span className="text-[9px] text-gray-400 uppercase font-black tracking-wider">{t('age')}</span><span className="text-xl font-black text-yellow-500">{b.age} <span className="text-[10px] text-white opacity-80">{t('years')}</span></span></div>
                   <div className="flex flex-col items-end"><span className="text-[9px] text-gray-400 uppercase font-black tracking-wider">{t('date')}</span><span className="text-xl font-black text-white">{b.day}/{filterMonth.toString().padStart(2, '0')}</span></div>
                </div>
                {userRole !== 'viewer' && (<button onClick={() => safeWhatsAppOpen(b.whatsapp, `🎉 Olá, ${b.name}! Feliz Aniversário! Muita paz, saúde e alegrias! ⚽🎂`)} className="w-full mt-5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-2.5 rounded-lg flex justify-center items-center gap-2 shadow-lg transition-colors"><Gift size={18}/> {t('send')}</button>)}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

const Configuracoes = ({ settings, saveSettings, passwords, savePasswords, importData }) => {
  const { userRole, t, showToast } = useAppContext();
  const [formData, setFormData] = useState(settings);
  const [passData, setPassData] = useState(passwords);

  const handleExport = () => {
    // Para simplificar a demonstração, você pode exportar do Firestore iterando, 
    // mas este trecho pode precisar ser ajustado se a base ficar gigantesca.
    // Opcionalmente, pode ser ignorado no modo cloud, já que a nuvem cuida disso.
    showToast("Os dados estão seguros na nuvem da Google!", "success");
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-black text-blue-950 mb-5 border-b pb-3 flex items-center gap-2"><Settings size={22}/> {t('set_club')}</h2>
          <div className="space-y-5">
            <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('club_name')}</label><input type="text" value={formData?.clubName || ''} onChange={e => setFormData({...formData, clubName: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-800" disabled={userRole === 'viewer'} /></div>
            {userRole !== 'viewer' && <ImageUploader label={t('club_logo')} currentImage={formData?.logoUrl} onImageChange={(img) => setFormData({...formData, logoUrl: img})} />}
            {userRole !== 'viewer' && <button onClick={() => saveSettings(formData)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3.5 rounded-xl flex justify-center items-center gap-2 font-black shadow-lg transition-colors"><Save size={20} /> {t('save')}</button>}
          </div>
        </div>
        {userRole === 'admin' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-black text-blue-950 mb-5 border-b pb-3 flex items-center gap-2"><Shield size={22}/> {t('sec_pass')}</h2>
              <div className="space-y-4">
                <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('pass_admin')}</label><input type="text" value={passData?.admin || ''} onChange={e => setPassData({...passData, admin: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold" /></div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('pass_view')}</label><input type="text" value={passData?.consulta || ''} onChange={e => setPassData({...passData, consulta: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold" /></div>
                <button onClick={() => savePasswords(passData)} className="w-full bg-blue-700 hover:bg-blue-600 text-white px-4 py-3.5 rounded-xl flex justify-center gap-2 font-black shadow-lg transition-colors mt-2"><Save size={20} /> {t('update')}</button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-black text-blue-950 mb-4 border-b pb-3 flex items-center gap-2"><HardDrive size={22}/> Segurança em Nuvem</h2>
              <div className="space-y-4">
                <p className="text-sm text-gray-500 font-medium">Os seus dados agora estão armazenados de forma ultra-segura na nuvem do Google Firebase. Não há mais perigo de limpar o cache e perder tudo!</p>
                <div className="flex gap-3">
                  <button onClick={handleExport} className="w-full bg-slate-800 hover:bg-slate-700 text-white px-4 py-3.5 rounded-xl flex justify-center items-center gap-2 font-black shadow transition-colors"><UploadCloud size={20} /> Banco na Nuvem Ativo</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function AppContent() {
  const { userRole, setUserRole, toastMsg, setToastMsg, showToast, t, lang } = useAppContext();
  const [loginPass, setLoginPass] = useState('');
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeModule, setActiveModule] = useState('financeiro');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { settings, passwords, members, transactions, payments, loadingData, saveSettings, savePasswords, saveMember, deleteMember, addTransaction, updateTransaction, deleteTransaction, savePayment, refundPayment, importData, resetMatchRoster } = useCloudDatabase();

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginPass === (passwords?.admin || 'admin123')) {
      setUserRole('admin');
      setActiveModule('financeiro');
      setActiveTab('dashboard');
    } else if (loginPass === (passwords?.consulta || 'consulta123')) {
      setUserRole('viewer');
      setActiveModule('financeiro');
      setActiveTab('dashboard');
    } else {
      showToast(t('wrong_pass'), 'error');
    }
  };

  if (loadingData) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
       <Settings size={48} className="animate-spin text-emerald-600" />
       <p className="text-sm font-bold text-emerald-800 animate-pulse uppercase tracking-widest">Sincronizando com a Nuvem...</p>
    </div>
  );

  if (!userRole) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        
        <div className="bg-slate-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center border border-slate-700 relative z-10">
          <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-slate-900 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)] border-2 border-emerald-500 overflow-hidden">
            {settings?.logoUrl ? <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-cover" /> : <div className="text-emerald-500 text-3xl font-black">{settings?.clubName?.charAt(0) || 'C'}</div>}
          </div>
          <h1 className="text-2xl font-black text-white mb-1 uppercase tracking-wider">{settings?.clubName || t('login_title')}</h1>
          <p className="text-xs text-slate-400 mb-8 font-medium">{t('login_sub')}</p>
          
          <LanguageSwitcher isLogin={true} />
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" placeholder={t('password')} value={loginPass} onChange={e=>setLoginPass(e.target.value)} className="w-full p-4 border border-slate-600 bg-slate-900 rounded-xl text-center font-black tracking-widest text-lg text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-600" />
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl text-lg uppercase tracking-wider shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] transition-all">
              {t('enter')}
            </button>
          </form>
        </div>
        {toastMsg && <Toast message={toastMsg.message} type={toastMsg.type} onClose={() => setToastMsg(null)} />}
      </div>
    );
  }

  const validTx = (transactions || []).filter(t => !t.isRefunded);
  const currentM = new Date().getMonth() + 1;
  const currentY = new Date().getFullYear();
  
  const currMonthTx = validTx.filter(t => {
    if(!t.date) return false;
    const parts = t.date.split('-');
    if(parts.length < 2) return false;
    return parseInt(parts[1], 10) === currentM && parseInt(parts[0], 10) === currentY;
  });
  
  const currYearTx = validTx.filter(t => t.date && t.date.split('-').length >= 1 && parseInt(t.date.split('-')[0], 10) === currentY);
  
  const stats = {
    activeMembers: (members || []).filter(m => m.status === 'Ativo').length,
    balance: validTx.reduce((acc, t) => t.type === 'income' ? acc + Number(t.amount) : acc - Number(t.amount), 0),
    monthlyIncome: currMonthTx.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0),
    monthlyExpense: currMonthTx.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0),
    annualIncome: currYearTx.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0),
    annualExpense: currYearTx.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0),
  };

  const handleModuleSwitch = (mod) => {
    setActiveModule(mod);
    if (mod === 'jogo') setActiveTab('presenca');
    if (mod === 'financeiro') setActiveTab('dashboard');
  };

  const navItems = [
    { id: 'presenca', label: t('nav_attendance'), icon: ClipboardList, show: true, module: 'jogo' },
    { id: 'sorteio', label: t('nav_draw'), icon: Swords, show: true, module: 'jogo' },
    
    { id: 'dashboard', label: t('nav_dashboard'), icon: Home, show: true, module: 'financeiro' }, 
    { id: 'livroCaixa', label: t('nav_cashbook'), icon: DollarSign, show: true, module: 'financeiro' },
    { id: 'associados', label: t('nav_members'), icon: Users, show: userRole === 'admin', module: 'financeiro' },
    { id: 'mensalidades', label: t('nav_monthly'), icon: Calendar, show: true, module: 'financeiro' },
    { id: 'inadimplentes', label: t('nav_defaulters'), icon: AlertTriangle, show: true, module: 'financeiro' }, 
    { id: 'aniversariantes', label: t('nav_birthdays'), icon: Gift, show: true, module: 'financeiro' },
    { id: 'configuracoes', label: t('nav_settings'), icon: Settings, show: true, module: 'financeiro' }
  ];

  if (activeTab === 'associados' && userRole === 'viewer') setActiveTab('presenca');

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800 font-sans print:bg-white overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @media print { 
          body { background: white; } 
          .print-area { width: 100% !important; margin: 0 !important; box-shadow: none !important; border: none !important; } 
        }
        .animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.3s ease-in-out; }
        ::-webkit-scrollbar { width: 6px; height: 6px;}
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}} />
      
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-20 print:hidden border-b border-slate-800">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-full bg-slate-800 border border-emerald-500 flex items-center justify-center overflow-hidden">
             {settings?.logoUrl ? <img src={settings.logoUrl} className="w-full h-full object-cover"/> : <span className="font-black text-emerald-500 text-xs">{settings?.clubName?.charAt(0) || 'C'}</span>}
           </div>
           <span className="font-black text-white text-sm uppercase tracking-wide">{settings?.clubName || 'Clube'}</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-emerald-400 p-1"><Menu size={24} /></button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed md:sticky top-0 h-screen w-64 bg-slate-900 text-white flex flex-col z-30 transition-transform print:hidden border-r border-slate-800 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 text-center border-b border-slate-800 relative shrink-0">
          <button className="md:hidden absolute top-4 right-4 text-slate-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}><X size={20}/></button>
          <div className="w-20 h-20 mx-auto rounded-full object-cover border-2 border-emerald-500 mb-3 bg-slate-800 overflow-hidden shadow-lg relative">
             {settings?.logoUrl ? <img src={settings.logoUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl font-black text-emerald-500">{settings?.clubName?.charAt(0) || 'C'}</div>}
          </div>
          <h1 className="font-black text-white text-lg uppercase tracking-wider leading-tight">{settings?.clubName || 'Clube'}</h1>
          <div className="mt-3 text-[10px] font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/30 rounded-full py-1 bg-emerald-500/10 shadow-inner">
            {userRole === 'admin' ? t('admin') : t('viewer')}
          </div>
          <div className="mt-2 text-[10px] font-bold text-emerald-300 flex justify-center items-center gap-1">
             <UploadCloud size={12}/> {t('cloud_sync')}
          </div>
        </div>

        {/* Module Switcher */}
        <div className="px-4 mb-2 mt-4 shrink-0 print:hidden">
          <div className="flex p-1 bg-slate-800 rounded-xl border border-slate-700">
            <button onClick={() => handleModuleSwitch('financeiro')} className={`flex-1 py-2 text-xs font-bold rounded-lg flex flex-col items-center gap-1 transition-colors ${activeModule === 'financeiro' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
              <DollarSign size={16} /> {t('tab_fin')}
            </button>
            <button onClick={() => handleModuleSwitch('jogo')} className={`flex-1 py-2 text-xs font-bold rounded-lg flex flex-col items-center gap-1 transition-colors ${activeModule === 'jogo' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
              <Swords size={16} /> {t('tab_game')}
            </button>
          </div>
        </div>

        <nav className="flex-1 py-2 px-3 space-y-1 overflow-y-auto">
          {navItems.filter(i => i.show && (i.module === activeModule || i.module === 'all')).map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === item.id ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
               <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'text-slate-500'} /> {item.label}
            </button>
          ))}
        </nav>
        <div className="shrink-0 p-4 border-t border-slate-800">
           <LanguageSwitcher />
           <button onClick={() => {setUserRole(null); setLoginPass('');}} className="w-full mt-2 flex items-center justify-center gap-2 text-slate-400 hover:text-red-400 p-3 rounded-xl hover:bg-slate-800 transition-colors font-bold text-sm"><LogOut size={18} /> {t('logout')}</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full relative">
        <header className="mb-8 hidden md:block print:hidden">
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
             {React.createElement(navItems.find(i => i.id === activeTab)?.icon || Home, { size: 32, className: 'text-emerald-600' })}
             {navItems.find(i => i.id === activeTab)?.label}
          </h2>
        </header>
        
        <div className="pb-12">
          {activeTab === 'dashboard' && <Dashboard stats={stats} transactions={validTx} currentYear={new Date().getFullYear()} />}
          {activeTab === 'livroCaixa' && <LivroCaixa transactions={transactions} onAdd={addTransaction} onUpdate={updateTransaction} onDelete={deleteTransaction} />}
          
          {activeTab === 'associados' && <Associados members={members} onSave={saveMember} onDelete={deleteMember} />}
          {activeTab === 'presenca' && <ListaPresenca members={members} onSave={saveMember} onResetMatch={resetMatchRoster} />}
          {activeTab === 'sorteio' && <Sorteio members={members} />}
          
          {activeTab === 'mensalidades' && <Mensalidades members={members} payments={payments} onSavePayment={savePayment} onAddTransaction={addTransaction} onRefundPayment={refundPayment} />}
          {activeTab === 'inadimplentes' && <Inadimplentes members={members} payments={payments} />}
          {activeTab === 'aniversariantes' && <Aniversariantes members={members} settings={settings} />}
          {activeTab === 'configuracoes' && <Configuracoes settings={settings} saveSettings={saveSettings} passwords={passwords} savePasswords={savePasswords} importData={importData} />}
        </div>
      </main>

      {toastMsg && <Toast message={toastMsg.message} type={toastMsg.type} onClose={() => setToastMsg(null)} />}
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, errorDetails: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, errorDetails: error }; }
  componentDidCatch(error, errorInfo) { console.error("Error Boundary Caught:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-8">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-2xl w-full border-t-8 border-red-500 text-center">
            <AlertTriangle size={64} className="mx-auto text-red-500 mb-6"/>
            <h1 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Falha Inesperada</h1>
            <p className="text-slate-500 mb-6 font-medium text-lg">Houve um erro na renderização da interface. Seus dados estão seguros na nuvem.</p>
            <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl overflow-x-auto text-xs font-mono mb-8 shadow-inner text-left max-h-48 overflow-y-auto">
               {this.state.errorDetails && this.state.errorDetails.toString()}
            </div>
            <button onClick={() => window.location.reload()} className="w-full bg-slate-800 text-white font-black py-4 rounded-xl shadow-lg hover:bg-slate-700 transition-colors text-lg uppercase tracking-wider">Recarregar Aplicativo</button>
          </div>
        </div>
      );
    }
    return this.props.children; 
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}