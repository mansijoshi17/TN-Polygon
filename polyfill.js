import { Buffer } from 'buffer';

window.global = window;
window.Buffer = Buffer;
global.process = {
    env: { DEBUG: undefined },
    version: '',
    nextTick: require('next-tick')
};