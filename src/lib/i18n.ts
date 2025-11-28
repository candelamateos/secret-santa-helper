import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Landing Page
      "secretSanta": "Secret Santa",
      "tagline": "Organize your family gift exchange with ease. Simple, fun, and perfect for everyone!",
      "createGroup": "Create a Group",
      "createGroupDesc": "Start a new Secret Santa group and invite your family with a simple code",
      "getMatched": "Get Matched",
      "getMatchedDesc": "Everyone joins, names are drawn, and you'll see who to buy for!",
      "readyToStart": "Ready to Start?",
      "joinGroup": "Join Group",
      "alreadyJoined": "Already joined? Enter your participant code to see your assignment",
      "viewMyAssignment": "View My Assignment →",
      "back": "Back",
      
      // Create Group
      "createNewGroup": "Create New Group",
      "createNewGroupDesc": "Start a Secret Santa for your family",
      "groupName": "Group Name",
      "groupNamePlaceholder": "e.g., Smith Family Christmas 2024",
      "yourName": "Your Name",
      "yourNamePlaceholder": "e.g., John",
      "creating": "Creating...",
      "createGroupButton": "Create Group",
      "groupCreatedSuccess": "Group created successfully!",
      "shareCode": "Share code",
      "errorCreatingGroup": "Error creating group",
      "fillAllFields": "Please fill in all fields",
      
      // Join Group
      "joinAGroup": "Join a Group",
      "joinGroupDesc": "Enter the group code to join",
      "groupCode": "Group Code",
      "groupCodePlaceholder": "e.g., ABC123",
      "groupCodeHelper": "Ask the organizer for the 6-character code",
      "yourNamePlaceholder2": "e.g., Sarah",
      "joining": "Joining...",
      "joinGroupButton": "Join Group",
      "successfullyJoined": "Successfully joined!",
      "welcomeTo": "Welcome to",
      "groupNotFound": "Group not found",
      "checkCode": "Please check the code and try again",
      "errorJoiningGroup": "Error joining group",
      
      // My Assignment
      "myAssignment": "My Assignment",
      "myAssignmentDesc": "Enter your participant code to view your Secret Santa assignment",
      "participantCode": "Participant Code",
      "participantCodePlaceholder": "e.g., ABC123",
      "participantCodeHelper": "You received this code when you joined the group",
      "loading": "Loading...",
      "viewMyAssignmentButton": "View My Assignment",
      "codeNotFound": "Code not found",
      "enterCode": "Please enter your code",
      "error": "Error",
      
      // Group View
      "participants": "Participants",
      "groupCodeLabel": "Group Code",
      "participantCodeLabel": "Your Code",
      "keepCodeSafe": "Keep this code safe to view your assignment later",
      "drawNames": "Draw Names",
      "redrawNames": "Redraw Names",
      "waitingForMore": "Waiting for more participants...",
      "needAtLeast": "Need at least 3 people to draw names",
      "namesDrawn": "Names have been drawn!",
      "yourAssignment": "Your Assignment",
      "youAreGivingTo": "You are giving a gift to",
      "theirWishlist": "Their wishlist",
      "noWishlist": "No wishlist yet",
      "yourWishlist": "Your Wishlist",
      "wishlistPlaceholder": "Share what you'd love to receive...",
      "shareGroupCode": "Share this code with your family to join",
      "drawingNames": "Drawing names...",
      "namesDrawnSuccess": "Names have been drawn successfully!",
      "errorDrawingNames": "Error drawing names",
      "wishlistUpdated": "Wishlist updated!",
      "errorUpdatingWishlist": "Error updating wishlist"
    }
  },
  es: {
    translation: {
      // Landing Page
      "secretSanta": "Amigo Invisible",
      "tagline": "Organiza tu intercambio de regalos familiar con facilidad. ¡Simple, divertido y perfecto para todos!",
      "createGroup": "Crear Grupo",
      "createGroupDesc": "Inicia un nuevo grupo de Amigo Invisible e invita a tu familia con un código simple",
      "getMatched": "Emparejamiento",
      "getMatchedDesc": "Todos se unen, se sortean los nombres y verás a quién comprarle",
      "readyToStart": "¿Listo para Empezar?",
      "joinGroup": "Unirse a Grupo",
      "alreadyJoined": "¿Ya te uniste? Introduce tu código de participante para ver tu asignación",
      "viewMyAssignment": "Ver Mi Asignación →",
      "back": "Atrás",
      
      // Create Group
      "createNewGroup": "Crear Nuevo Grupo",
      "createNewGroupDesc": "Inicia un Amigo Invisible para tu familia",
      "groupName": "Nombre del Grupo",
      "groupNamePlaceholder": "ej., Familia García Navidad 2024",
      "yourName": "Tu Nombre",
      "yourNamePlaceholder": "ej., Juan",
      "creating": "Creando...",
      "createGroupButton": "Crear Grupo",
      "groupCreatedSuccess": "¡Grupo creado con éxito!",
      "shareCode": "Comparte el código",
      "errorCreatingGroup": "Error al crear el grupo",
      "fillAllFields": "Por favor completa todos los campos",
      
      // Join Group
      "joinAGroup": "Unirse a un Grupo",
      "joinGroupDesc": "Introduce el código del grupo para unirte",
      "groupCode": "Código del Grupo",
      "groupCodePlaceholder": "ej., ABC123",
      "groupCodeHelper": "Pide al organizador el código de 6 caracteres",
      "yourNamePlaceholder2": "ej., Sara",
      "joining": "Uniéndose...",
      "joinGroupButton": "Unirse al Grupo",
      "successfullyJoined": "¡Unido con éxito!",
      "welcomeTo": "Bienvenido a",
      "groupNotFound": "Grupo no encontrado",
      "checkCode": "Por favor verifica el código e intenta de nuevo",
      "errorJoiningGroup": "Error al unirse al grupo",
      
      // My Assignment
      "myAssignment": "Mi Asignación",
      "myAssignmentDesc": "Introduce tu código de participante para ver tu asignación de Amigo Invisible",
      "participantCode": "Código de Participante",
      "participantCodePlaceholder": "ej., ABC123",
      "participantCodeHelper": "Recibiste este código cuando te uniste al grupo",
      "loading": "Cargando...",
      "viewMyAssignmentButton": "Ver Mi Asignación",
      "codeNotFound": "Código no encontrado",
      "enterCode": "Por favor introduce tu código",
      "error": "Error",
      
      // Group View
      "participants": "Participantes",
      "groupCodeLabel": "Código del Grupo",
      "participantCodeLabel": "Tu Código",
      "keepCodeSafe": "Guarda este código de forma segura para ver tu asignación más tarde",
      "drawNames": "Sortear Nombres",
      "redrawNames": "Volver a Sortear",
      "waitingForMore": "Esperando más participantes...",
      "needAtLeast": "Se necesitan al menos 3 personas para sortear nombres",
      "namesDrawn": "¡Los nombres han sido sorteados!",
      "yourAssignment": "Tu Asignación",
      "youAreGivingTo": "Le vas a dar un regalo a",
      "theirWishlist": "Su lista de deseos",
      "noWishlist": "Aún no hay lista de deseos",
      "yourWishlist": "Tu Lista de Deseos",
      "wishlistPlaceholder": "Comparte lo que te gustaría recibir...",
      "shareGroupCode": "Comparte este código con tu familia para unirse",
      "drawingNames": "Sorteando nombres...",
      "namesDrawnSuccess": "¡Los nombres han sido sorteados con éxito!",
      "errorDrawingNames": "Error al sortear nombres",
      "wishlistUpdated": "¡Lista de deseos actualizada!",
      "errorUpdatingWishlist": "Error al actualizar lista de deseos"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
