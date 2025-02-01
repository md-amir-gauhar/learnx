import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import express, { Request, Response } from 'express'
import prisma from 'src/config/db.config'
import { validate } from 'src/middlewares/validate';
import { loginSchema, registerSchema } from 'src/schemas/auth';
import { config } from 'src/config';
import AuthenticationError from 'src/errors/authentication-error';





const router = express.Router()


router.post('/register', validate(registerSchema), async(req: Request, res: Response): Promise<any> => {
    try {
        const {email, password, organizationName} = req.body;
        const existingUser = await prisma.user.findUnique({
            where: email
        })

        if(existingUser) {
            return res.status(400).json({error: 'User with same email already exists. Please log in or try different email'})
        }

        const hashedpassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedpassword,
                organization: {
                    create: {
                        name: organizationName
                    }
                }
            },
            include: {
                organization: true
            }
        })

        const {password: _, ...userWithoutPassword} = user

        const token = jwt.sign({userId: user.id}, config.JWT_SECRET )
        res.json({token, user: userWithoutPassword})
    } catch (err) {

    }
})

router.post('/login', validate(loginSchema), async (req, res): Promise<any> => {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({
        where: { email },
        include: { organization: true },
      });
  
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return new AuthenticationError('Invalid Credentialls!!!')
      }
  
      const { password: _, ...userWithoutPassword } = user;
  
      const token = jwt.sign({ userId: user.id }, config.JWT_SECRET);
      res.json({ token, user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ error: 'Login failed' });
    }
  });

//   router.post(
//     '/domain',
//     authMiddleware,
//     validate(customDomainSchema),
//     async (req, res) => {
//       try {
//         const { customDomain } = req.body;
//         const userId = req.user!.userId;
  
//         // Check if domain is already in use
//         const existingDomain = await prisma.organization.findUnique({
//           where: { customDomain },
//         });
  
//         if (existingDomain) {
//           return res.status(400).json({ error: 'Domain already in use' });
//         }
  
//         const organization = await prisma.organization.update({
//           where: { userId },
//           data: { customDomain },
//         });
  
//         res.json(organization);
//       } catch (error) {
//         res.status(400).json({ error: 'Failed to update domain' });
//       }
//     }
//   );
  
  // Update Razorpay credentials with validation
//   router.post(
//     '/razorpay',
//     authMiddleware,
//     validate(razorpaySchema),
//     async (req, res) => {
//       try {
//         const { razorpayKey, razorpaySecret } = req.body;
//         const userId = req.user!.userId;
  
//         const organization = await prisma.organization.update({
//           where: { userId },
//           data: { razorpayKey, razorpaySecret },
//         });
  
//         // Remove sensitive data from response
//         const { razorpaySecret: _, ...orgWithoutSecret } = organization;
//         res.json(orgWithoutSecret);
//       } catch (error) {
//         res.status(400).json({ error: 'Failed to update Razorpay credentials' });
//       }
//     }
//   );
  
  // Authentication endpoint for third-party apps
//   router.post('/authenticate/:domain', async (req, res) => {
//     try {
//       const { domain } = req.params;
//       const apiKey = req.headers['x-api-key'];
  
//       if (!domain && !apiKey) {
//         return res.status(400).json({ error: 'Domain or API key required' });
//       }
  
//       const organization = await prisma.organization.findFirst({
//         where: {
//           OR: [
//             { customDomain: domain },
//             { apiKey: apiKey as string }
//           ]
//         },
//         select: {
//           id: true,
//           name: true,
//           customDomain: true,
//           apiKey: true,
//         },
//       });
  
//       if (!organization) {
//         return res.status(401).json({ error: 'Invalid domain or API key' });
//       }
  
//       res.json({ authenticated: true, organization });
//     } catch (error) {
//       res.status(400).json({ error: 'Authentication failed' });
//     }
//   });
  
  export default router;
