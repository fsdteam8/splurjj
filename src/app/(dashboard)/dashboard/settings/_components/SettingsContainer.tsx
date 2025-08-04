"use client";

import { useState } from "react";
import PersonalInfo from "../personal-info/page";
import ChangePassword from "../change-password/page";
import SettingsMenu from "./settings-menu";


export default function SettingsContainer() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  if (activeSection === "personal") {
    return <PersonalInfo />;
  }

  if (activeSection === "password") {
    return <ChangePassword  />;
  }

  return <SettingsMenu onSectionSelect={setActiveSection} />;
}
