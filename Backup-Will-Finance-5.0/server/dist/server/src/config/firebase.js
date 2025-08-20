"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = void 0;
exports.initializeFirebaseAdmin = initializeFirebaseAdmin;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
exports.admin = firebase_admin_1.default;
function initializeFirebaseAdmin() {
    if (firebase_admin_1.default.apps.length === 0) {
        firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.applicationDefault(),
        });
    }
}
//# sourceMappingURL=firebase.js.map