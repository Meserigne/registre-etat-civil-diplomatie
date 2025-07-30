export const en = {
  // Navigation and menus
  nav: {
    title: 'Civil Registry',
    subtitle: 'Ministry of Foreign Affairs - Ivorian Diplomacy',
    dashboard: 'Dashboard',
    dossiers: 'Files',
    actes: 'Certificates',
    agents: 'Agents',
    users: 'Users',
    statistics: 'Statistics',
    settings: 'Settings',
    logout: 'Logout'
  },

  // Buttons and actions
  buttons: {
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    import: 'Import',
    print: 'Print',
    download: 'Download',
    view: 'View',
    select: 'Select',
    create: 'Create',
    update: 'Update',
    submit: 'Submit',
    reset: 'Reset'
  },

  // Forms
  forms: {
    // User information
    userInfo: 'User Information',
    lastName: 'Last Name',
    firstName: 'First Name',
    birthDate: 'Birth Date',
    birthPlace: 'Birth Place',
    nationality: 'Nationality',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    address: 'Address',
    phone: 'Phone',
    email: 'Email',
    
    // File information
    fileInfo: 'File Information',
    fileType: 'File Type',
    fileNumber: 'File Number',
    trackingNumber: 'Tracking Number',
    depositDate: 'Deposit Date',
    withdrawalDate: 'Withdrawal Date',
    status: 'Status',
    agent: 'Agent',
    observations: 'Observations',
    
    // Validation
    required: 'This field is required',
    invalidEmail: 'Invalid email',
    invalidPhone: 'Invalid phone number'
  },

  // Status
  status: {
    inProgress: 'In Progress',
    completed: 'Completed',
    pending: 'Pending',
    readyForActe: 'Ready for Certificate Creation',
    acteCreated: 'Certificate Created',
    cancelled: 'Cancelled'
  },

  // File types
  fileTypes: {
    birth: 'Birth',
    death: 'Death',
    marriage: 'Marriage',
    divorce: 'Divorce',
    adoption: 'Adoption',
    recognition: 'Recognition',
    legitimation: 'Legitimation',
    correction: 'Correction',
    transcription: 'Transcription'
  },

  // Certificate types
  acteTypes: {
    birthExtract: 'Birth Certificate Extract',
    deathExtract: 'Death Certificate Extract',
    marriageExtract: 'Marriage Certificate Extract',
    marriageCopy: 'Marriage Full Copy',
    birthCopy: 'Birth Full Copy',
    deathCopy: 'Death Full Copy',
    familyBook: 'Family Book',
    correction: 'Correction',
    transcription: 'Transcription'
  },

  // Certificate management
  actes: {
    title: 'Certificate Management',
    newConsularActe: 'Consular Certificate (New Format)',
    originalActe: 'Original Certificate (Classic Format)',
    selectEligibleFile: 'Select an Eligible File',
    eligibleFilesIndicator: 'eligible file(s) for certificate creation',
    noEligibleFiles: 'No eligible files (status must be "Completed" or "Ready for certificate creation")',
    acteNumber: 'Certificate No.',
    user: 'User',
    type: 'Type',
    fileStatus: 'File Status',
    date: 'Date',
    officer: 'Officer',
    actions: 'Actions',
    preview: 'Preview',
    downloadPDF: 'Download PDF',
    
    // Certificate creation
    createActe: 'Create a Certificate',
    acteCreation: 'Certificate Creation',
    acteInfo: 'Certificate Information',
    creationDate: 'Creation Date',
    creationPlace: 'Creation Place',
    officer: 'Officer',
    parentsInfo: 'Parents Information',
    fatherName: 'Father\'s Name',
    fatherBirthDate: 'Father\'s Birth Date',
    fatherBirthPlace: 'Father\'s Birth Place',
    fatherProfession: 'Father\'s Profession',
    fatherAddress: 'Father\'s Address',
    motherName: 'Mother\'s Name',
    motherBirthDate: 'Mother\'s Birth Date',
    motherBirthPlace: 'Mother\'s Birth Place',
    motherProfession: 'Mother\'s Profession',
    motherAddress: 'Mother\'s Address'
  },

  // Messages
  messages: {
    success: {
      fileCreated: 'File created successfully!',
      fileUpdated: 'File updated successfully!',
      fileDeleted: 'File deleted successfully!',
      acteCreated: 'Certificate created successfully!',
      acteUpdated: 'Certificate updated successfully!',
      settingsSaved: 'Settings saved successfully!'
    },
    error: {
      requiredFields: 'Please fill in all required fields',
      fileNotFound: 'File not found',
      acteNotFound: 'Certificate not found',
      noFileSelected: 'No file selected',
      serverError: 'Server error, please try again',
      unauthorized: 'Unauthorized access'
    },
    confirm: {
      deleteFile: 'Are you sure you want to delete this file?',
      deleteActe: 'Are you sure you want to delete this certificate?',
      logout: 'Are you sure you want to logout?'
    }
  },

  // Birth certificate (official document)
  birthCertificate: {
    title: 'Official Document - Birth Certificate Extract',
    consularCircumscription: 'CONSULAR CIRCUMSCRIPTION',
    denmark: 'OF DENMARK',
    copenhagenCenter: 'COPENHAGEN CENTER',
    registry: 'from the Registry',
    civilRegistry: 'From the Civil Status Registry',
    forYear: 'For the year',
    birthOf: 'BIRTH OF:',
    bornOn: 'On',
    at: 'At',
    minutes: 'minutes',
    bornIn: 'Born in',
    child: 'The child',
    gender: 'Gender',
    daughterOf: 'Daughter of',
    sonOf: 'Son of',
    financialAttache: 'Financial Attaché',
    secretary: 'Secretary',
    spouse: 'his spouse',
    mentions: 'MENTIONS (If any)',
    marriedOn: 'Married on',
    with: 'With',
    marriageDissolvedBy: 'Marriage dissolved by divorce decision dated',
    deceasedOn: 'Deceased on',
    certifyExtract: 'Certifies this extract conforms to the indications',
    containedInRegistry: 'contained in the registry.',
    deliveredIn: 'Delivered in',
    civilStatusOfficer: 'The Civil Status Officer',
    signature: '(Signature)',
    fiscalStamp: 'FISCAL STAMP',
    seal: 'SEAL',
    printDocument: 'Print document',
    downloadPDF: 'Download PDF'
  },

  // Language settings
  language: {
    title: 'Language',
    french: 'Français',
    english: 'English',
    switchTo: 'Switch to',
    currentLanguage: 'Current language'
  }
};

export default en;
