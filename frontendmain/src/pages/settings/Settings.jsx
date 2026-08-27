import { Save, Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Settings</h2>
          <p>
            Configure your CRM preferences.
          </p>
        </div>

        <button className="primary-button">
          <Save size={18} />
          Save Changes
        </button>
      </div>

      <div className="panel settings-panel">
        <div className="module-placeholder">
          <SettingsIcon size={48} />
          <h3>CRM Settings</h3>
          <p>
            Application settings will appear
            here.
          </p>
        </div>
      </div>
    </div>
  );
}