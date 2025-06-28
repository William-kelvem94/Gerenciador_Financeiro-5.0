import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  password: Yup.string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .required('Senha é obrigatória'),
});

export const registerSchema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  email: Yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  password: Yup.string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .required('Senha é obrigatória'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), ''], 'As senhas devem coincidir')
    .required('Confirmação de senha é obrigatória'),
});

export const transactionSchema = Yup.object().shape({
  description: Yup.string().required('Descrição é obrigatória'),
  amount: Yup.number().typeError('Valor inválido').required('Valor é obrigatório'),
  date: Yup.date().required('Data é obrigatória'),
  category: Yup.string().required('Categoria é obrigatória'),
});
