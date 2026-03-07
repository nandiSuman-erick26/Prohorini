"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAppSelector } from "@/hooks/redux/store/rootRedux";
import { SelectIsProfileComplete, selectProfileCompletion } from "@/hooks/redux/store/user/userSelector";


const ProfileCompletionCard = () => {
  const percentage = useAppSelector(selectProfileCompletion)
  const isComplete =useAppSelector(SelectIsProfileComplete)
  return (
    <Card className="border border-slate-200 shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="p-5 border-b border-slate-100 bg-slate-50/30">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
              Profile Status
            </h2>
            {isComplete ? (
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
                Complete
              </span>
            ) : (
              <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 uppercase tracking-wider">
                Action Required
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-2xl font-black text-slate-900 leading-none">
                {percentage}%
              </span>
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">
                Finished
              </span>
            </div>
            <Progress value={percentage} className="h-2 bg-slate-100" />
            <p className="text-[11px] text-slate-400 font-medium">
              {isComplete
                ? "Your profile is fully optimized."
                : "Complete your profile to unlock all features."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionCard;
