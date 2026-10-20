"use client";

import { useMemo, useState } from "react";

type MortgageCardProps = {
  priceLabel: string;
};

export function MortgageCard({ priceLabel }: MortgageCardProps) {
  const parsed = Number.parseInt(priceLabel.replace(/\D/g, ""), 10);
  const [calc, setCalc] = useState({
    price: Number.isFinite(parsed) ? parsed : 0,
    down: 20,
    rate: 6.5,
    years: 30,
  });

  const monthly = useMemo(() => {
    const principal = calc.price * (1 - calc.down / 100);
    const rate = calc.rate / 100 / 12;
    const periods = calc.years * 12;
    if (!periods) return 0;
    if (!rate) return principal / periods;
    return (principal * (rate * Math.pow(1 + rate, periods))) / (Math.pow(1 + rate, periods) - 1);
  }, [calc]);

  return (
    <aside className="mortgage-card">
      <span className="eyebrow">MORTGAGE ESTIMATE</span>
      <h3>${Math.round(monthly).toLocaleString()} / month</h3>
      <label>
        Purchase price
        <input
          type="number"
          value={calc.price}
          onChange={(event) => setCalc({ ...calc, price: Number(event.target.value) })}
        />
      </label>
      <label>
        Down payment %
        <input
          type="number"
          value={calc.down}
          onChange={(event) => setCalc({ ...calc, down: Number(event.target.value) })}
        />
      </label>
      <label>
        Interest rate %
        <input
          type="number"
          step="0.1"
          value={calc.rate}
          onChange={(event) => setCalc({ ...calc, rate: Number(event.target.value) })}
        />
      </label>
      <label>
        Term
        <select
          value={calc.years}
          onChange={(event) => setCalc({ ...calc, years: Number(event.target.value) })}
        >
          <option value="30">30 years</option>
          <option value="20">20 years</option>
          <option value="15">15 years</option>
        </select>
      </label>
      <small>Estimate only. Taxes, insurance and lender fees not included.</small>
    </aside>
  );
}
