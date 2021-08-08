import { Request, Response, NextFunction } from 'express';
import { syserror } from '../util/util';
import jwt from 'jsonwebtoken';

const verifyJWT = (request: Request, response: Response, next: NextFunction) => {
    const token = request.headers['x-access-token'] as string;
    const secret = process.env.JWT_SECRET as string;
    if (!token) return syserror(401, response, 'Token indefinido.');
    jwt.verify(token, secret, (err, decoded) => {
        if (err)
            return syserror(401, response, 'Falha na autenticação do Token.');
        request.idUsuario = decoded?.id;
        next();
    });
}

const verifyAdminJWT = (request: Request, response: Response, next: NextFunction) => {
    const token = request.headers['x-access-token'] as string;
    const secret = process.env.JWT_ADMIN_SECRET as string;
    if (!token) return syserror(403, response, 'Rota disponível apenas para Admins');
    jwt.verify(token, secret, (err, decoded) => {
        if (err)
            return syserror(401, response, 'Falha na autenticação do Token.');
        request.idUsuario = decoded?.id;
        next();
    });
}

const existJWT = (request: Request, response: Response, next: NextFunction) => {
    const token = request.headers['x-access-token'] as string;
    const secret = process.env.JWT_SECRET as string;
    if (!token) {
        console.log('Acesso sem login.');
        next();
        return;
    }
    jwt.verify(token, secret, (err, decoded) => {
        if (err)
            return syserror(401, response, 'Nenhum usuário logado.');
        request.idUsuario = decoded?.id;
        next();
    });
}

export default { authorization: verifyJWT, adminAuth: verifyAdminJWT, identify: existJWT };