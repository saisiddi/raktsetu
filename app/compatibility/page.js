import { t } from "@/lib/i18n";
import { BLOOD_COMPATIBILITY } from "@/lib/bloodCompatibility";

export const metadata = {
  title: "Blood Group Compatibility — RaktSetu",
  description:
    "Check red blood cell compatibility across ABO and Rh blood groups for donors and recipients.",
};

function GroupList({ groups }) {
  return (
    <ul className="flex flex-wrap gap-1">
      {groups.map((group) => (
        <li
          key={group}
          className="rounded-full bg-brand-light px-2 py-0.5 text-sm font-medium text-brand-dark"
        >
          {group}
        </li>
      ))}
    </ul>
  );
}

export default function CompatibilityPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">
        {t("bloodCompatibility.title")}
      </h1>

      {/* overflow-x-auto makes the table scroll sideways on narrow screens */}
      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[32rem] text-left">
          <caption className="sr-only">{t("bloodCompatibility.title")}</caption>
          <thead className="bg-gray-50 text-sm text-gray-700">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">
                {t("bloodCompatibility.bloodGroupHeader")}
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                {t("bloodCompatibility.canDonateToHeader")}
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                {t("bloodCompatibility.canReceiveFromHeader")}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {BLOOD_COMPATIBILITY.map(({ group, donateTo, receiveFrom }) => (
              <tr key={group}>
                <th
                  scope="row"
                  className="px-4 py-3 text-lg font-bold text-brand"
                >
                  {group}
                </th>
                <td className="px-4 py-3">
                  <GroupList groups={donateTo} />
                </td>
                <td className="px-4 py-3">
                  <GroupList groups={receiveFrom} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
