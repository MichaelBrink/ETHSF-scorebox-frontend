import { NextApiRequest, NextApiResponse } from "next";

const COINMARKET_KEY = process.env.COINMARKET_KEY
const COVALENT_KEY = process.env.COVALENT_KEY
const COVALENT_ENDPOINT = `${process.env.BACKEND_BASE_URL}/credit_score/covalent`

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
        try { 
            const body = 
                {
                eth_address: req.body.eth_address,
                covalent_key:COVALENT_KEY,
                coinmarketcap_key:COINMARKET_KEY,
                loan_request: req.body.loan_request,
                chain_id: req.body.chainId,
                }
                console.log(body)
            const backend_response = await fetch(COVALENT_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body),
            })

            const covalentScore = await backend_response.json();

            res.send({covalentScore})
        } catch(error){
            res.send({error})
            console.log({error})
        }
}