import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const fields = [
  { name: "fullName", label: "Full Name*", note: "as per your PAN card", placeholder: "Type your answer here...", required: true },
  { name: "panNumber", label: "PAN number*", note: "Description (optional)", placeholder: "Type your answer here...", required: true },
  { name: "address1", label: "Address line 1*", note: "as per your Aadhaar card", placeholder: "Type your answer here...", required: true },
  { name: "address2", label: "Address line 2*", note: "as per your Aadhaar card (include your Pincode too)", placeholder: "Type your answer here...", required: true },
  { name: "phone", label: "Phone Number*", note: "Description (optional)", placeholder: "081234 56789", required: true },
  { name: "email", label: "Email Address*", note: "Description (optional)", placeholder: "name@example.com", required: true },
  { name: "gender", label: "Gender*", note: "Description (optional)", required: true },
  { name: "maritalStatus", label: "Marital Status*", note: "Description (optional)", required: true },
  { name: "dob", label: "Date of Birth*", note: "Description (optional)", required: true },
  { name: "dependents", label: "Number of loved ones who are financially dependent on you*", note: "Description (optional)", required: true },
  { name: "incomeSource", label: "Source of Income*", note: "Description (optional)", required: true },
  { name: "parentIncomeSource", label: "Parent's source of income*", note: "Description (optional)", required: true },
  { name: "currencyPreference", label: "What Currency would you like to share primary numbers in?*", note: "Feel free to use different currencies for for different questions if needed", required: true},
  { name: "currentMonthlyIncome", label: "What is your current monthly income?", placeholder: "Type your answer here...", description: "Please mention INR 5L as 500000"},
  { name: "currentExpenses", label: "What is your current monthly expenses?*", description: "Please mention INR 2L as 200000", placeholder: "Type your answer here…"},
  { name: "overallInvestment", label: "What is the approx. sum of your overall investment (total of EPF/Mutual Funds/PPF, FD etc)?*", placeholder: "Type your answer here...", description: "Please mention INR 10L as 1000000"},
  { name: "monthlyEMIs", label: "What is the sum total of all your EMIs (monthly numbers)?", placeholder: "Type your answer here...", description: "Please mention INR 5L as 500000"},
  { name: "investmentHorizon", label: "What is your investment horizon, i.e., how long can you keep your money invested in the market before needing access to it?*", note: "Description (optional)", required: true},
  { name: "investmentUnderstanding", label: "How well do you understand investing in the equity markets?*", note: "Description (optional)", required: true},
  { name: "incomeStability", label: "Nature of your current and future income sources are*", note: "(example: salary, business income, investment income, etc)",required: true},
  { name: "investmentObjective", label: "From the following 5 possible investment scenarios, please select the option that defines your investment objective.*", note: "Description (optional)", required: true},
  { name: "investmentResilience", label: "If your investment outlook is long-term (more than five years), how long will you hold on to a poorly performing portfolio before cashing in?*", note: "Description (optional)", required: true},
  { name: "portfolioReaction", label: "If a few months after investing, the value of your investments declines by 20%, what would you do?*", note: "Description (optional)", required: true},

];

const RiskProfileForm = () => {
  const [step, setStep] = useState(-1);
  const [formData, setFormData] = useState({});
  const [customGenderChoices, setCustomGenderChoices] = useState([]);
  const [genderChoice, setGenderChoice] = useState("");
  const [customMaritalChoices, setCustomMaritalChoices] = useState([]);
  const [maritalChoice, setMaritalChoice] = useState("");
  const [dependentsRows, setDependentsRows] = useState([
    "Son(s)", "Daughter(s)", "Dependent Parent(s)", "Dependent Sibling(s)", "Dependent Parent-in-law(s)"
  ]);
  const [dependentsCols, setDependentsCols] = useState(["None", "1", "2"]);
  const [dependentsData, setDependentsData] = useState({});
  const [incomeChoices, setIncomeChoices] = useState([
    "Stable (Govt Job or Secure Private - example - Tata Steel, Reliance, LT)",
    "Profession - Doctor/Lawyer/Accountant/Architect",
    "Pvt - High Income at beginning but would peak and last as 15-20 years career - Marketing, Consulting, Tech jobs",
    "Self Business - Growth industry (10%+ YoY Growth)",
    "Business - Moderate Growth Industry (<10% YoY Growth)",
    "Retired - Pension",
    "Retired - No Pension",
  ]);
  const [customIncomeChoices, setCustomIncomeChoices] = useState([]);
  const [selectedIncome, setSelectedIncome] = useState("");
  const [parentIncomeChoices, setParentIncomeChoices] = useState([
    "Pension - Government / Or retirement planning",
    "Currently Working - Govt",
    "Currently Working - Private",
    "No Pension, lacked retirement planning",
    "Not Applicable (Parents not alive)"
  ]);
  const [selectedParentIncome, setSelectedParentIncome] = useState("");

  const [currencyChoices, setCurrencyChoices] = useState([
    "Indian Rupee (INR)",
    "United States Dollar (USD)",
    "Great Britain Pound (GBP)",
    "Euros (EUR)",
    "Other"
  ]);
const [selectedCurrency, setSelectedCurrency] = useState("");

  const [investmentHorizonChoices, setInvestmentHorizonChoices] = useState([
    "Upto 2 years",
    "2-3 years",
    "3-5 years",
    "5-10 years",
    "10+ years"
  ]);
  const [selectedHorizon, setSelectedHorizon] = useState("");

  const [investmentUnderstandingChoices, setInvestmentUnderstandingChoices] = useState([
    "I am a novice. I don’t understand the markets at all",
    "I have basic understanding of investing. I understand the risks and basic investment",
    "I have an amateur interest in investing. I have invested earlier on my own. I understand how markets fluctuate and the pros and cons of different investment classes.",
    "I am an experienced investor. I have invested in different markets and understand different investment strategies. I have my own investment philosophy."
  ]);
  const [selectedUnderstanding, setSelectedUnderstanding] = useState("");

  const [incomeStabilityChoices, setIncomeStabilityChoices] = useState([
    "Very unstable",
    "Unstable",
    "Somewhat stable",
    "Stable",
    "Very Stable"
  ]);
  const [selectedStability, setSelectedStability] = useState("");

  const [investmentObjectiveChoices, setInvestmentObjectiveChoices] = useState([
    "I cannot consider any Loss",
    "I can consider Loss of 4% if the possible Gains are of 10%",
    "I can consider Loss of 8% if the possible Gains are of 22%",
    "I can consider Loss of 14% if the possible Gains are of 30%",
    "I can consider Loss of 25% if the possible Gains are of 50%"
  ]);
  const [selectedObjective, setSelectedObjective] = useState("");

  const [investmentResilienceChoices, setInvestmentResilienceChoices] = useState([
    "Will not hold & cash in immediately if there is an erosion of my capital",
    "I’d hold for 3 months",
    "I’d hold for 6 months",
    "I’d hold for one year",
    "I’d hold for up to two years",
    "I’d hold for more than two years."
  ]);
  const [selectedResilience, setSelectedResilience] = useState("");

  const [portfolioReactionChoices, setPortfolioReactionChoices] = useState([
    "Cut losses immediately and liquidate all investments. Capital preservation is paramount.",
    "Cut your losses and transfer investments to safer asset classes.",
    "You would be worried, but would give your investments a little more time.",
    "You are ok with volatility and accept decline in portfolio value as a part of investing. You would keep your investments as they are",
    "You would add to your investments to bring the average buying price lower. You are confident about your investments and are not perturbed by notional losses."
  ]);
  const [selectedReaction, setSelectedReaction] = useState("");




  const handleChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, [fields[step].name]: value });
  };

  const handleNext = () => {
    if (step < fields.length - 1) {
      setStep(step + 1);
    } else {
      console.log("Form submitted:", formData);
    }
  };

  const handleStart = () => setStep(0);

  const handleSelect = (fieldName, value, setter) => {
    setFormData({ ...formData, [fieldName]: value });
    setter(value);
  };

  const addCustomChoice = (type) => {
    if (type === "gender") setCustomGenderChoices([...customGenderChoices, ""]);
    else if (type === "marital") setCustomMaritalChoices([...customMaritalChoices, ""]);
    else if (type === "income") setIncomeChoices([...incomeChoices, { isCustom: true, value: "" }]);
    else if (type === "parentIncome") {setParentIncomeChoices([...parentIncomeChoices, { value: "", isCustom: true }]);
  }
    else if (type === "currency") {setCurrencyChoices([...currencyChoices, { isCustom: true, value: "" }]);
  }

      
  };

  const updateCustomChoice = (type, index, value) => {
    const updated =
      type === "gender" ? [...customGenderChoices] :
      type === "marital" ? [...customMaritalChoices] :
      [...incomeChoices];
    updated[index] = value;
    if (type === "gender") setCustomGenderChoices(updated);
    else if (type === "marital") setCustomMaritalChoices(updated);
    else if (type === "income") {
    const updatedCustom = [...customIncomeChoices];
    updatedCustom[index] = value;
    setCustomIncomeChoices(updatedCustom);

    const updatedIncome = [...incomeChoices];
    updatedIncome[index] = value;
    setIncomeChoices(updatedIncome);
  }
  };

  const addDependentRow = () => setDependentsRows([...dependentsRows, ""]);
  const addDependentColumn = () => setDependentsCols([...dependentsCols, String(dependentsCols.length)]);
  const handleDependentRadio = (row, col) => setDependentsData({ ...dependentsData, [row]: col });

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-3xl text-gray-800">
        <div className="flex justify-end mb-8">
          <img src="/src/assets/images/logo_png.png" alt="Turtle Logo" className="h-10 w-auto" />
        </div>

        {step === -1 ? (
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">Let’s understand your risk profile.</h2>
            <p className="text-lg text-gray-500">To make the financial advice personalized & useful.</p>
            <div className="flex items-center justify-center gap-2">
              <button onClick={handleStart} className="bg-white px-8 py-3 rounded-full text-black text-xl font-medium shadow-xl hover:shadow-2xl transition duration-300">Let’s begin</button>
              <span className="text-sm text-gray-700 font-semibold">press <kbd className="bg-black text-white px-2 py-1 rounded">Enter ↵</kbd></span>
            </div>
            <p className="text-sm text-gray-500 flex justify-center items-center gap-2"><span>⏱️</span> Takes X minutes</p>
          </div>
        ) : (
          <div>
            <p className="mb-1 text-lg">{step + 1} → {fields[step].label}</p>
            <p className="mb-2 text-gray-500 italic">{fields[step].note}</p>

            {fields[step].name === "phone" ? (
              <PhoneInput
                country={"in"}
                value={formData.phone || ""}
                onChange={(phone) => setFormData({ ...formData, phone })}
                inputClass="!text-lg !pl-14 !w-full !py-2 !border-b !border-gray-300"
                buttonClass="!border-b !border-gray-300"
                containerClass="!mb-6"
              />
            ) : fields[step].name === "gender" ? (
              <div className="space-y-3">
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleSelect("gender", "Male", setGenderChoice)} className={`rounded-full px-4 py-2 border ${genderChoice === "Male" ? "bg-gray-300" : "bg-gray-100"} text-left`}>Ⓐ Male</button>
                  <button onClick={() => handleSelect("gender", "Female", setGenderChoice)} className={`rounded-full px-4 py-2 border ${genderChoice === "Female" ? "bg-gray-300" : "bg-gray-100"} text-left`}>Ⓑ Female</button>
                  {customGenderChoices.map((choice, idx) => (
                    <input key={idx} type="text" placeholder="Custom choice..." value={choice} onChange={(e) => updateCustomChoice("gender", idx, e.target.value)} className="border-b border-gray-300 text-lg py-1 px-2" />
                  ))}
                </div>
                <button onClick={() => addCustomChoice("gender")} className="underline text-base text-black mt-1">Add choice</button>
              </div>
            ) : fields[step].name === "maritalStatus" ? (
              <div className="space-y-3">
                <div className="flex flex-col gap-2">
                  {["Married", "Unmarried", "Divorced", "Separated", "Widow/Widower"].map((label, i) => (
                    <button key={i} onClick={() => handleSelect("maritalStatus", label, setMaritalChoice)} className={`rounded-full px-4 py-2 border ${maritalChoice === label ? "bg-gray-300" : "bg-gray-100"} text-left`}>
                      {String.fromCharCode(65 + i)}. {label}
                    </button>
                  ))}
                  {customMaritalChoices.map((choice, idx) => (
                    <input key={idx} type="text" placeholder="Custom choice..." value={choice} onChange={(e) => updateCustomChoice("marital", idx, e.target.value)} className="border-b border-gray-300 text-lg py-1 px-2" />
                  ))}
                </div>
                <button onClick={() => addCustomChoice("marital")} className="underline text-base text-black mt-1">Add choice</button>
              </div>
            ) : fields[step].name === "dob" ? (
              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  <div>
                    <label className="block text-sm text-gray-600">Day</label>
                    <select className="border-b border-gray-300 text-xl px-2 py-1" value={formData.dobDay || ""} onChange={(e) => setFormData({ ...formData, dobDay: e.target.value })}>
                      <option value="">DD</option>
                      {[...Array(31)].map((_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Month</label>
                    <select className="border-b border-gray-300 text-xl px-2 py-1" value={formData.dobMonth || ""} onChange={(e) => setFormData({ ...formData, dobMonth: e.target.value })}>
                      <option value="">MM</option>
                      {[...Array(12)].map((_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Year</label>
                    <select className="border-b border-gray-300 text-xl px-2 py-1" value={formData.dobYear || ""} onChange={(e) => setFormData({ ...formData, dobYear: e.target.value })}>
                      <option value="">YYYY</option>
                      {[...Array(100)].map((_, i) => {
                        const year = new Date().getFullYear() - i;
                        return <option key={i} value={year}>{year}</option>;
                      })}
                    </select>
                  </div>
                </div>
              </div>
            ) : fields[step].name === "dependents" ? (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span></span>
                  <div className="flex gap-4">
                    <button onClick={addDependentColumn} className="underline">Add column</button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="table-auto w-full text-left">
                    <thead>
                      <tr>
                        <th></th>
                        {dependentsCols.map((col, i) => (
                          <th key={i} className="px-4">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dependentsRows.map((row, i) => (
                        <tr key={i} className="bg-gray-100">
                          <td className="px-4 py-2">
  <input
    className="border-b border-gray-400"
    value={row}
    onChange={(e) => {
      const updated = [...dependentsRows];
      updated[i] = e.target.value;
      setDependentsRows(updated);
    }}
  />
</td>

                          {dependentsCols.map((col, j) => (
                            <td key={j} className="text-center">
                              <input
                                type="radio"
                                name={`dependent-${i}`}
                                checked={dependentsData[row] === col}
                                onChange={() => handleDependentRadio(row, col)}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button onClick={addDependentRow} className="underline text-base text-black mt-1">Add row</button>
              </div>
            ) : fields[step].name === "incomeSource" ? (
              
  <div className="space-y-3">
    <div className="flex flex-col gap-2">
      {incomeChoices.map((choiceObj, i) =>
        typeof choiceObj === "object" && choiceObj.isCustom ? (
          <input
            key={i}
            type="text"
            placeholder="Custom choice..."
            value={choiceObj.value}
            onChange={(e) => {
              const updated = [...incomeChoices];
              updated[i].value = e.target.value;
              setIncomeChoices(updated);
            }}
            className="border-b border-gray-300 text-lg py-1 px-2"
          />
        ) : (
          <button
            key={i}
            onClick={() =>
              handleSelect("incomeSource", choiceObj.value || choiceObj, setSelectedIncome)
            }
            className={`rounded-full px-4 py-2 border ${
              selectedIncome === (choiceObj.value || choiceObj)
                ? "bg-gray-300"
                : "bg-gray-100"
            } text-left`}
          >
            {String.fromCharCode(65 + i)}. {choiceObj.value || choiceObj}
          </button>
        )
      )}
    </div>
    <button
      onClick={() =>
        setIncomeChoices([...incomeChoices, { isCustom: true, value: "" }])
      }
      className="underline text-base text-black mt-1"
    >
      Add choice
    </button>
  </div>
) : fields[step].name === "parentIncomeSource" ? (
  <div className="space-y-3">
    <div className="flex flex-col gap-2">
      {parentIncomeChoices.map((choiceObj, i) =>
        typeof choiceObj === "object" && choiceObj.isCustom ? (
          <input
            key={i}
            type="text"
            placeholder="Custom choice..."
            value={choiceObj.value}
            onChange={(e) => {
              const updated = [...parentIncomeChoices];
              updated[i].value = e.target.value;
              setParentIncomeChoices(updated);
            }}
            className="border-b border-gray-300 text-lg py-1 px-2"
          />
        ) : (
          <button
            key={i}
            onClick={() =>
              handleSelect("parentIncomeSource", choiceObj.value || choiceObj, setSelectedParentIncome)
            }
            className={`rounded-full px-4 py-2 border ${
              selectedParentIncome === (choiceObj.value || choiceObj)
                ? "bg-gray-300"
                : "bg-gray-100"
            } text-left`}
          >
            {String.fromCharCode(65 + i)}. {choiceObj.value || choiceObj}
          </button>
        )
      )}
    </div>
    <button
      onClick={() =>
        setParentIncomeChoices([...parentIncomeChoices, { isCustom: true, value: "" }])
      }
      className="underline text-base text-black mt-1"
    >
      Add choice
    </button>
  </div>
  ) : fields[step].name === "investmentHorizon" ? (
  <div className="space-y-3">
    <div className="flex flex-col gap-2">
      {investmentHorizonChoices.map((choiceObj, i) =>
        typeof choiceObj === "object" && choiceObj.isCustom ? (
          <input
            key={i}
            type="text"
            placeholder="Custom choice..."
            value={choiceObj.value}
            onChange={(e) => {
              const updated = [...investmentHorizonChoices];
              updated[i].value = e.target.value;
              setInvestmentHorizonChoices(updated);
            }}
            className="border-b border-gray-300 text-lg py-1 px-2"
          />
        ) : (
          <button
            key={i}
            onClick={() =>
              handleSelect("investmentHorizon", choiceObj.value || choiceObj, setSelectedHorizon)
            }
            className={`rounded-full px-4 py-2 border ${
              selectedHorizon === (choiceObj.value || choiceObj)
                ? "bg-gray-300"
                : "bg-gray-100"
            } text-left`}
          >
            {String.fromCharCode(65 + i)}. {choiceObj.value || choiceObj}
          </button>
        )
      )}
    </div>
    <button
      onClick={() =>
        setInvestmentHorizonChoices([
          ...investmentHorizonChoices,
          { isCustom: true, value: "" }
        ])
      }
      className="underline text-base text-black mt-1"
    >
      Add choice
    </button>
  </div>

) : fields[step].name === "currencyPreference" ? (
  <div className="space-y-3">
    <div className="flex flex-col gap-2">
      {currencyChoices.map((choiceObj, i) =>
        typeof choiceObj === "object" && choiceObj.isCustom ? (
          <input
            key={i}
            type="text"
            placeholder="Custom choice..."
            value={choiceObj.value}
            onChange={(e) => {
              const updated = [...currencyChoices];
              updated[i].value = e.target.value;
              setCurrencyChoices(updated);
            }}
            className="border-b border-gray-300 text-lg py-1 px-2"
          />
        ) : (
          <button
            key={i}
            onClick={() =>
              handleSelect("currencyPreference", choiceObj.value || choiceObj, setSelectedCurrency)
            }
            className={`rounded-full px-4 py-2 border ${
              selectedCurrency === (choiceObj.value || choiceObj)
                ? "bg-gray-300"
                : "bg-gray-100"
            } text-left`}
          >
            {String.fromCharCode(65 + i)}. {choiceObj.value || choiceObj}
          </button>
        )
      )}
    </div>
    <button
      onClick={() =>
        setCurrencyChoices([...currencyChoices, { isCustom: true, value: "" }])
      }
      className="underline text-base text-black mt-1"
    >
      Add choice
    </button>
  </div>
  ) : fields[step].name === "incomeStability" ? (
  <div className="space-y-3">
    <div className="flex flex-col gap-2">
      {incomeStabilityChoices.map((choiceObj, i) =>
        typeof choiceObj === "object" && choiceObj.isCustom ? (
          <input
            key={i}
            type="text"
            placeholder="Custom choice..."
            value={choiceObj.value}
            onChange={(e) => {
              const updated = [...incomeStabilityChoices];
              updated[i].value = e.target.value;
              setIncomeStabilityChoices(updated);
            }}
            className="border-b border-gray-300 text-lg py-1 px-2"
          />
        ) : (
          <button
            key={i}
            onClick={() =>
              handleSelect("incomeStability", choiceObj.value || choiceObj, setSelectedStability)
            }
            className={`rounded-full px-4 py-2 border ${
              selectedStability === (choiceObj.value || choiceObj)
                ? "bg-gray-300"
                : "bg-gray-100"
            } text-left`}
          >
            {String.fromCharCode(65 + i)}. {choiceObj.value || choiceObj}
          </button>
        )
      )}
    </div>
    <button
      onClick={() =>
        setIncomeStabilityChoices([
          ...incomeStabilityChoices,
          { isCustom: true, value: "" }
        ])
      }
      className="underline text-base text-black mt-1"
    >
      Add choice
    </button>
  </div>

  ) : fields[step].name === "investmentUnderstanding" ? (
  <div className="space-y-3">
    <div className="flex flex-col gap-2">
      {investmentUnderstandingChoices.map((choiceObj, i) =>
        typeof choiceObj === "object" && choiceObj.isCustom ? (
          <input
            key={i}
            type="text"
            placeholder="Custom choice..."
            value={choiceObj.value}
            onChange={(e) => {
              const updated = [...investmentUnderstandingChoices];
              updated[i].value = e.target.value;
              setInvestmentUnderstandingChoices(updated);
            }}
            className="border-b border-gray-300 text-lg py-1 px-2"
          />
        ) : (
          <button
            key={i}
            onClick={() =>
              handleSelect("investmentUnderstanding", choiceObj.value || choiceObj, setSelectedUnderstanding)
            }
            className={`rounded-full px-4 py-2 border ${
              selectedUnderstanding === (choiceObj.value || choiceObj)
                ? "bg-gray-300"
                : "bg-gray-100"
            } text-left`}
          >
            {String.fromCharCode(65 + i)}. {choiceObj.value || choiceObj}
          </button>
        )
      )}
    </div>
    <button
      onClick={() =>
        setInvestmentUnderstandingChoices([
          ...investmentUnderstandingChoices,
          { isCustom: true, value: "" }
        ])
      }
      className="underline text-base text-black mt-1"
    >
      Add choice
    </button>
  </div>
  ) : fields[step].name === "investmentObjective" ? (
  <div className="space-y-3">
    <div className="flex flex-col gap-2">
      {investmentObjectiveChoices.map((choiceObj, i) =>
        typeof choiceObj === "object" && choiceObj.isCustom ? (
          <input
            key={i}
            type="text"
            placeholder="Custom choice..."
            value={choiceObj.value}
            onChange={(e) => {
              const updated = [...investmentObjectiveChoices];
              updated[i].value = e.target.value;
              setInvestmentObjectiveChoices(updated);
            }}
            className="border-b border-gray-300 text-lg py-1 px-2"
          />
        ) : (
          <button
            key={i}
            onClick={() =>
              handleSelect(
                "investmentObjective",
                choiceObj.value || choiceObj,
                setSelectedObjective
              )
            }
            className={`rounded-full px-4 py-2 border ${
              selectedObjective === (choiceObj.value || choiceObj)
                ? "bg-gray-300"
                : "bg-gray-100"
            } text-left`}
          >
            {String.fromCharCode(65 + i)}. {choiceObj.value || choiceObj}
          </button>
        )
      )}
    </div>
    <button
      onClick={() =>
        setInvestmentObjectiveChoices([
          ...investmentObjectiveChoices,
          { isCustom: true, value: "" },
        ])
      }
      className="underline text-base text-black mt-1"
    >
      Add choice
    </button>
  </div>

  ) : fields[step].name === "investmentResilience" ? (
  <div className="space-y-3">
    <div className="flex flex-col gap-2">
      {investmentResilienceChoices.map((choiceObj, i) =>
        typeof choiceObj === "object" && choiceObj.isCustom ? (
          <input
            key={i}
            type="text"
            placeholder="Custom choice..."
            value={choiceObj.value}
            onChange={(e) => {
              const updated = [...investmentResilienceChoices];
              updated[i].value = e.target.value;
              setInvestmentResilienceChoices(updated);
            }}
            className="border-b border-gray-300 text-lg py-1 px-2"
          />
        ) : (
          <button
            key={i}
            onClick={() =>
              handleSelect("investmentResilience", choiceObj.value || choiceObj, setSelectedResilience)
            }
            className={`rounded-full px-4 py-2 border ${
              selectedResilience === (choiceObj.value || choiceObj)
                ? "bg-gray-300"
                : "bg-gray-100"
            } text-left`}
          >
            {String.fromCharCode(65 + i)}. {choiceObj.value || choiceObj}
          </button>
        )
      )}
    </div>
    <button
      onClick={() =>
        setInvestmentResilienceChoices([
          ...investmentResilienceChoices,
          { isCustom: true, value: "" }
        ])
      }
      className="underline text-base text-black mt-1"
    >
      Add choice
    </button>
  </div>
  ) : fields[step].name === "portfolioReaction" ? (
  <div className="space-y-3">
    <div className="flex flex-col gap-2">
      {portfolioReactionChoices.map((choiceObj, i) =>
        typeof choiceObj === "object" && choiceObj.isCustom ? (
          <input
            key={i}
            type="text"
            placeholder="Custom choice..."
            value={choiceObj.value}
            onChange={(e) => {
              const updated = [...portfolioReactionChoices];
              updated[i].value = e.target.value;
              setPortfolioReactionChoices(updated);
            }}
            className="border-b border-gray-300 text-lg py-1 px-2"
          />
        ) : (
          <button
            key={i}
            onClick={() =>
              handleSelect("portfolioReaction", choiceObj.value || choiceObj, setSelectedReaction)
            }
            className={`rounded-full px-4 py-2 border ${
              selectedReaction === (choiceObj.value || choiceObj)
                ? "bg-gray-300"
                : "bg-gray-100"
            } text-left`}
          >
            {String.fromCharCode(65 + i)}. {choiceObj.value || choiceObj}
          </button>
        )
      )}
    </div>
    <button
      onClick={() =>
        setPortfolioReactionChoices([
          ...portfolioReactionChoices,
          { isCustom: true, value: "" }
        ])
      }
      className="underline text-base text-black mt-1"
    >
      Add choice
    </button>
  </div>


) : fields[step].name === "currentMonthlyIncome" ? (
  <div className="space-y-2">
    <p className="text-sm text-gray-500">{fields[step].description}</p>
    <input
      type="number"
      placeholder={fields[step].placeholder}
      className="w-full border-b border-gray-300 text-xl text-gray-800 outline-none mb-6 placeholder-gray-400 py-2"
      value={formData[fields[step].name] || ""}
      onChange={handleChange}
    />
  </div>
) : (
  <div className="space-y-2">
    {fields[step].description && (
      <p className="text-sm text-gray-500">{fields[step].description}</p>
    )}
    <input
      type="text"
      className="w-full border-b border-gray-300 text-xl text-gray-800 outline-none mb-6 placeholder-gray-400 py-2"
      placeholder={fields[step].placeholder}
      value={formData[fields[step].name] || ""}
      onChange={handleChange}
    />
  </div>
)
}

            <button onClick={handleNext} className="bg-teal-400 px-6 py-2 rounded-full text-black font-medium hover:bg-teal-500 mt-4">
              {fields[step].name === "dob" ? "OK ✓" : "Next"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskProfileForm;
