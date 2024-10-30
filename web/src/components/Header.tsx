import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
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
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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
    <header className="bg-red-300">
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
            Cart
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {userInfo?.name ?? "No name"}
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
                <DropdownMenuItem>
                  Billing
                  <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Settings
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Keyboard shortcuts
                  <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>Email</DropdownMenuItem>
                      <DropdownMenuItem>Message</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>More...</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem>
                  New Team
                  <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>GitHub</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuItem disabled>API</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Log out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
{
  {
    /*       <Nav className="ms-auto"> */
  }
  {
    /*         <SearchBox /> */
  }
  {
    /*         <Link */
  }
  {
    /*           to="/cart" */
  }
  {
    /*           className="d-flex align-items-center text-white text-decoration-none" */
  }
  {
    /*         > */
  }
  {
    /*           <Icon */
  }
  {
    /*             icon="fluent:shopping-bag-16-regular" */
  }
  {
    /*             width="24" */
  }
  {
    /*             height="24" */
  }
  {
    /*           /> */
  }
  {
    /*           Cart */
  }
  {
    /*           {totalItems > 0 && ( */
  }
  {
    /*             <Badge pill bg="success" style={{ marginLeft: "5px" }}> */
  }
  {
    /*               {totalItems} */
  }
  {
    /*             </Badge> */
  }
  {
    /*           )} */
  }
  {
    /*         </Link> */
  }
  {
    /* Admin Links */
  }
  {
    /*         {userInfo && userInfo.isAdmin && ( */
  }
  {
    /*           <NavDropdown title="Admin" id="adminmenu" className="me-0"> */
  }
  {
    /*             <NavDropdown.Item onClick={() => navigate("/admin/products")}> */
  }
  {
    /*               Products */
  }
  {
    /*             </NavDropdown.Item> */
  }
  {
    /*             <NavDropdown.Item onClick={() => navigate("/admin/orders")}> */
  }
  {
    /*               Orders */
  }
  {
    /*             </NavDropdown.Item> */
  }
  {
    /*             <NavDropdown.Item onClick={() => navigate("/admin/users")}> */
  }
  {
    /*               Users */
  }
  {
    /*             </NavDropdown.Item> */
  }
  {
    /*           </NavDropdown> */
  }
  {
    /*         )} */
  }
  {
    /* INFO: There's a bug where the menu is still after the user logs out, checking for name property fixes it */
  }

  {
    /*         {userInfo && userInfo.name ? */
  }
  {
    /*           <NavDropdown */
  }
  {
    /*             title={userInfo.name} */
  }
  {
    /*             id="username" */
  }
  {
    /*             className="me-0" */
  }
  {
    /*           > */
  }
  {
    /*             <NavDropdown.Item onClick={() => navigate("/profile")}> */
  }
  {
    /*               Profile */
  }
  {
    /*             </NavDropdown.Item> */
  }
  {
    /*             <NavDropdown.Item as="button" onClick={handleLogout}> */
  }
  {
    /*               Logout */
  }
  {
    /*             </NavDropdown.Item> */
  }
  {
    /*           </NavDropdown> */
  }
  {
    /*         ) : ( */
  }
  {
    /*           <Link */
  }
  {
    /*             to="/login" */
  }
  {
    /*             className="d-flex align-items-center text-white text-decoration-none" */
  }
  {
    /*           > */
  }
  {
    /*             <Icon icon="uil:signin" width="22" height="22" /> */
  }
  {
    /*             sign in / sign up */
  }
  {
    /*           </Link> */
  }
  {
    /*         )} */
  }
  {
    /*       </Nav> */
  }
  {
    /*     </Navbar.Collapse> */
  }
  /*   </Container> */
}
