import { Link, useNavigate } from "react-router-dom";
// import { Icon } from "@iconify/react";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useLogoutMutation } from "../features/user/slice";
import { resetCreds } from "../features/auth/slice";
import { resetCart } from "../features/cart/slice";
import SearchBox from "./SearchBox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

export function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const totalItems = useAppSelector((state) => state.cart.products.length);
  const { userInfo } = useAppSelector((state) => state.auth);

  const [logout] = useLogoutMutation();

  async function handleLogout() {
    try {
      await logout().unwrap();
      dispatch(resetCreds());
      dispatch(resetCart());
      navigate("/login");
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log(e as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast(e as any, {
        type: "error",
      });
    }
  }

  return (
    <header className="">
      <nav className="sticky top-0 min-h-16 flex items-center justify-between p-2 max-w-screen-2xl mx-auto w-full">
        <Link
          to="/"
          className="me-6 text-2xl font-bold hover:text-neutral-700/80"
        >
          Shopp-e
        </Link>
        <div className="flex space-x-4">
          <SearchBox />
          <Separator orientation="vertical" />
          <Button variant="outline" size="sm">
            Cart {totalItems.toFixed()}
          </Button>
          {/* userInfo && userInfo.name so that it renders the button correctly when logged */}
          {userInfo && userInfo.name ? (
            userInfo.isAdmin ? (
              <AdminMenu userInfo={userInfo} handleLogout={handleLogout} />
            ) : (
              <Menu userInfo={userInfo} handleLogout={handleLogout} />
            )
          ) : (
            <Button onClick={() => navigate("/login")}>Login</Button>
          )}
        </div>
      </nav>
    </header>
  );
}

function AdminMenu(props: {
  userInfo: any;
  handleLogout: () => Promise<void>;
}) {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {props.userInfo.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate("/profile")}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigate("/admin/products")}>
            Products
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/admin/orders")}>
            Orders
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/admin/users")}>
            Users
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={props.handleLogout}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Menu(props: { userInfo: any; handleLogout: () => Promise<void> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {props.userInfo.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={props.handleLogout}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
