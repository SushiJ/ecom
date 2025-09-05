import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useLogoutMutation } from "../features/user/slice";
import { resetCreds } from "../features/auth/slice";
import { resetCart } from "../features/cart/slice";

import SearchBox from "@/components/SearchBox";
import { Separator } from "@/components/ui/separator";
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
import { Icon } from "@iconify/react";

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
	function isAdmin(role: string) {
		return role === "admin";
	}

	return (
		<header>
			<nav className="sticky top-0 min-h-16 flex items-center justify-between max-w-screen-2xl mx-auto w-full">
				<Link
					to="/"
					className="hidden md:block md:text-2xl lg:font-bold hover:text-neutral-700/80"
				>
					Shopp-e
				</Link>
				<Link
					to="/"
					className="md:hidden lg:font-bold hover:text-neutral-700/80 bg-black text-white px-1 rounded-sm text-2xl"
				>
					S
				</Link>
				<div className="flex space-x-4 items-center">
					<SearchBox />
					<Separator orientation="vertical" />
					<Link to="/cart">
						<Button variant="outline" size="sm" className="relative">
							<Icon icon="solar:cart-4-line-duotone" width="32" height="32" />
							<span className="absolute top-[-0.5rem] right-[-0.5rem] bg-neutral-800 text-white px-1.5 py-0.5 rounded text-xs">
								{totalItems.toFixed()}
							</span>
						</Button>
					</Link>
					{/* userInfo && userInfo.name so that it renders the button correctly when logged */}
					{userInfo && userInfo.name ? (
						isAdmin(userInfo.role) ? (
							<AdminMenu userInfo={userInfo} handleLogout={handleLogout} />
						) : (
							<Menu userInfo={userInfo} handleLogout={handleLogout} />
						)
					) : (
						<Button size="sm" onClick={() => navigate("/login")}>
							Login
						</Button>
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
				<div>
					<Button className="hidden lg:block" variant="outline" size="sm">
						{props.userInfo.name}
					</Button>
					<Button className="lg:hidden" variant="outline" size="sm">
						<Icon
							icon="solar:hamburger-menu-line-duotone"
							width="32"
							height="32"
						/>
					</Button>
				</div>
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
	const navigate = useNavigate();
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
					<DropdownMenuItem onClick={() => navigate("/profile")}>
						Profile
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={props.handleLogout}>
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
