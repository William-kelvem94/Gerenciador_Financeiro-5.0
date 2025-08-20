"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', (req, res) => res.json({ message: 'DataMode route' }));
exports.default = router;
//# sourceMappingURL=dataMode.js.map