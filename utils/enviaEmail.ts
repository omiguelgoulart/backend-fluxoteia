import nodemailer from "nodemailer";
import dotenv from "dotenv"

dotenv.config();

export async function enviaEmail(email: string, nome: string, codigo: string) {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    secure: false,
    auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  });


  const mensagem = `
<h3 style="color: #4CAF50;">Olá, ${nome}!</h3>
<p>Recebemos uma solicitação para recuperação da sua senha na nossa plataforma.</p>
<p>Seu código de recuperação é:</p>
<p style="font-size: 20px; font-weight: bold; color: #ff5722;">${codigo}</p>
<p>Este código é válido por <strong>10 minutos</strong>. Caso você não tenha solicitado a recuperação, ignore esta mensagem. Sua conta continuará segura.</p>
<hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
<p style="font-size: 14px;">Se precisar de ajuda, entre em contato com nossa equipe pelo e-mail: <a href="mailto:support@ternosavenida.com" style="color: #4CAF50;">support@ternosavenida.com</a>.</p>
<p>Atenciosamente,</p>
<p><strong>Equipe Ternos Avenida</strong> </p>

  `;

  try {
    const info = await transporter.sendMail({
        from: '"Ternos Avenida" <no-reply@beautyavenida.com>',
        to: email, 
        subject: "Recuperação de Senha",
        html: mensagem, 
    });

    console.log("Mensagem enviada: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Erro ao enviar o e-mail: ", error);
    return { success: false, error };
  }
}

export default enviaEmail;
