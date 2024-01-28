import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAppSelector } from "../hooks/redux";

const Profile = () => {
  const navigate = useNavigate();

  const { userInfo } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  return <pre>{JSON.stringify(userInfo, null, 2)}</pre>;
};

export default Profile;
