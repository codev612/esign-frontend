"use client";

import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Signupcheck: React.FC = () => {
  const router = useRouter();
  const [code, setCode] = useState<string[]>(Array(6).fill("")); // Create an array with 6 empty strings
  const [email, setEmail] = useState<string>("");
  const [state, setState] = useState<string>("");

  const handleChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;

    // Allow only one digit
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newCode = [...code];

      newCode[index] = value;
      setCode(newCode);

      // Focus next input field
      if (value && index < 5) {
        document.getElementById(`digit-${index + 1}`)?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      // Focus previous input if backspace is pressed on empty input
      document.getElementById(`digit-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (
    event: React.ClipboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    const pastedData = event.clipboardData.getData("text");

    // Check if pasted data is exactly 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split("").map((digit) => digit);

      setCode(newCode);
      document.getElementById(`digit-5`)?.focus(); // Focus last input
      event.preventDefault(); // Prevent default paste behavior
    } else {
      event.preventDefault(); // Prevent invalid paste
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const verificationCode = code.join(""); // Join the array to submit as a string

    console.log("Verification code submitted:", verificationCode);

    const response = await fetch("/api/verifycode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: Cookies.get("email"),
        code: verificationCode,
      }),
    });

    if (!response.ok) {
      setState("Invalid code");
      return;
    } else {
      const data = await response.json();
      const jwtToken = data.token; // Get the token

      Cookies.set("ESIGN_TOKEN", jwtToken);
      router.push("/signuppass"); // Navigate to the next step
    }
  };

  useEffect(() => {
    setEmail(Cookies.get("email") || "");
  }, []);

  return (
    <form
      className="flex flex-col items-start justify-center bg-background gap-4 rounded-md max-w-lg"
      onSubmit={handleSubmit}
    >
      <p style={{ fontSize: "1.5rem", fontWeight: 500 }}>Check your inbox</p>
      <p className="text-text mb-2 text-sm">
        We sent you a confirmation code to {email}.
      </p>

      <div className="flex flex-col w-full">
        <p>6-digit code</p>
        <div className="flex justify-between w-full gap-1">
          {code.map((digit, index) => (
            <input
              key={index}
              required
              className="w-16 h-12 text-center text-xl border border-gray-300 rounded-md"
              id={`digit-${index}`}
              maxLength={1}
              type="text"
              value={digit}
              onChange={(event) => handleChange(index, event)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onPaste={(event) => handlePaste(event, index)}
            />
          ))}
        </div>
        <p className="text-error">{state}</p>
      </div>

      <div className="flex flex-col">
        <p>
          {"Didn't get the code?"}
          <Button type="submit">Resend the code</Button>
        </p>
        <p>
          Wrong email?
          <Link href="/signupfree">Use a different email address</Link>
        </p>
      </div>

      <Button
        fullWidth
        className="text-white"
        color="primary"
        size="md"
        type="submit"
      >
        Next
        <ArrowForwardOutlinedIcon fontSize="small" />
      </Button>
    </form>
  );
};

export default Signupcheck;
