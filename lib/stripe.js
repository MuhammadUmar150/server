import Stripe from 'stripe'
import dotenv from 'dotenv'

dotenv.config();

const stripe = new Stripe("sk_test_51Q80DeP5MEnmPScI0cXEAYLbR16NfZyA6YIH1jDqjH55G0u9aQfY8EP3K05OKtcum1vAwLDxLCvSAi3eAiBS77KS00hRiOzkFh")

export default stripe;