export function triggerRegisterModal(promptOrOption?: { id: string; text: string; emoji: string } | string) {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('open-register-modal', { detail: promptOrOption }));
    }
}

export function triggerCitizenshipModal() {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('open-citizenship-modal'));
    }
}
