import { Request, Router } from 'express';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import MercadoPago from 'mercadopago';

const paymentsRouter = Router();

const getFullUrl = (req: Request) => {
  const url = `${req.protocol}://${req.get('host')}`;
  return url;
};

paymentsRouter.get(
  '/checkout/:id/:email/:description/:amount',
  async (request, response) => {
    try {
      // const user_id = request.user.id;

      MercadoPago.configure({
        sandbox: process.env.SANDBOX === 'true',
        access_token: process.env.MP_ACCESS_TOKEN,
      });

      const { id, email, description, amount } = request.params;

      // Create purchase item object template
      const purchaseOrder = {
        items: [
          {
            id,
            title: description,
            description,
            quantity: 1,
            currency_id: 'BRL',
            unit_price: parseFloat(amount),
          },
        ],
        payer: {
          email,
        },
        auto_return: 'all',
        external_reference: id,
        back_urls: {
          success: `${getFullUrl(request)}/payments/success`,
          pending: `${getFullUrl(request)}/payments/pending`,
          failure: `${getFullUrl(request)}/payments/failure`,
        },
      };

      // Generate init_point to checkout
      try {
        const preference = await MercadoPago.preferences.create(purchaseOrder);
        console.log(preference.body.init_point);
        return response.redirect(`${preference.body.init_point}`);
      } catch (err) {
        return response.send(err.message);
      }
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },
);

paymentsRouter.get('/success', (req, res) => {
  return res.render('success_screen');
});

paymentsRouter.get('/pending', (req, res) => {
  return res.render('pending_screen');
});

paymentsRouter.get('/failure', (req, res) => {
  return res.render('failure_screen');
});

export default paymentsRouter;
