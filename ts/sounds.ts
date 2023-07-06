export const soundsOn = new Audio('./assets/sounds/on.mp3') as HTMLAudioElement;
export const soundsOff = new Audio('./assets/sounds/off.mp3') as HTMLAudioElement;
export const coins = new Audio('./assets/sounds/coins.mp3') as HTMLAudioElement;
export const drawerOpen = new Audio('./assets/sounds/drawer_open.mp3') as HTMLAudioElement;
export const drawerClose = new Audio('./assets/sounds/drawer_close.mp3') as HTMLAudioElement;
export const resetQuantities = new Audio('./assets/sounds/reset.mp3') as HTMLAudioElement;
export const increase = new Audio('./assets/sounds/increase.mp3') as HTMLAudioElement;
export const decrease = new Audio('./assets/sounds/decrease.mp3') as HTMLAudioElement;

export const enableSounds = (): void => {
	const soundIcon = document.querySelector('.js-button-sound') as HTMLButtonElement;
	soundIcon.innerHTML = `<svg viewBox="294 384 24 24" class="sound__icon">
		<path d="M296,391.625c0,0.173,0.14,0.313,0.313,0.313h1.25v12.188c0,0.026,0.022,0.043,0.028,0.067s-0.006,0.049,0.005,0.072c0.01,0.021,0.03,0.031,0.044,0.049c0.014,0.017,0.024,0.03,0.041,0.044c0.056,0.047,0.121,0.079,0.193,0.08c0,0,0,0,0.001,0s0,0,0,0c0.047,0,0.094-0.011,0.139-0.032l4.235-2.118l4.235,2.118c0.044,0.021,0.093,0.032,0.14,0.032c0.073,0,0.139-0.033,0.195-0.081c0.016-0.013,0.025-0.025,0.039-0.042c0.015-0.018,0.035-0.028,0.046-0.05c0.012-0.024,0-0.05,0.005-0.074c0.006-0.024,0.027-0.04,0.027-0.065v-12.188c4.819,0,7.813,1.317,7.813,3.438c0,0.173,0.14,0.313,0.313,0.313s0.313-0.14,0.313-0.313v-8.75c0-0.173-0.14-0.313-0.313-0.313s-0.313,0.14-0.313,0.313c0,2.12-2.993,3.438-7.813,3.438h-10.625c-0.173,0-0.313,0.14-0.313,0.313V391.625z"/>
	</svg>Sounds are on`;
	coins.muted = false;
	drawerOpen.muted = false;
	drawerClose.muted = false;
	resetQuantities.muted = false;
	increase.muted = false;
	decrease.muted = false;
};

export const disableSounds = (): void => {
	const soundIcon = document.querySelector('.js-button-sound') as HTMLButtonElement;
	soundIcon.innerHTML = `<svg viewBox="294 384 24 24" class="sound__icon">
		<path d="M306.938,396.938c4.819,0,7.813,1.317,7.813,3.438c0,0.173,0.14,0.313,0.313,0.313s0.313-0.14,0.313-0.313v-8.75c0-0.173-0.14-0.313-0.313-0.313s-0.313,0.14-0.313,0.313c0,2.12-2.993,3.438-7.813,3.438h-10.625c-0.173,0-0.313,0.14-0.313,0.313v1.25c0,0.173,0.14,0.313,0.313,0.313h1.25H306.938z"/>
	</svg>Sounds are off`;
	coins.muted = true;
	drawerOpen.muted = true;
	drawerClose.muted = true;
	resetQuantities.muted = true;
	increase.muted = true;
	decrease.muted = true;
};
