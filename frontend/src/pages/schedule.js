/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  BellIcon,
  MenuIcon,
  XIcon,
  PencilIcon,
  CheckIcon,
} from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";
import { useAuth } from "../context/AuthContext";
import { parseCookies } from "nookies";
import { useFetch } from "../hooks/useFetch";
import AddEventFloating from "../components/AddEventFloating/AddEventFloating";
import api from "../services/api";
import { useForm } from "react-hook-form";
import NotificationsFloating from "../components/NotificationsFloating/NotificationsFloating";

const navigation = ["Agenda", "Meus Eventos"];
const profile = ["Sign out"];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Schedule() {
  const { register, handleSubmit } = useForm();
  const { user, signOut } = useAuth();
  const { data, isValidating } = useFetch("/schedule");
  const { data: invites } = useFetch("/invites");
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [editEvent, setEditEvent] = useState(null);
  if (isValidating) {
    return <h1 id="loading-text">Carregando..</h1>;
  }

  function handleShowAddEvent() {
    setShowAddEvent(!showAddEvent);
  }

  function handleSignOut(e) {
    e.preventDefault();
    signOut();
  }

  async function handleExcludeEvent(event_id) {
    try {
      await api.delete(`/events/${event_id}`);
      alert("Evento removido com sucesso");
    } catch (error) {
      alert("Não foi possível remover evento");
    }
  }
  async function handleEditEvent(formData, event_id) {
    try {
      await api.put(`/events/${event_id}`, formData);
      alert("Evento editado com sucesso");
      setEditEvent(null);
    } catch (error) {
      alert("Não foi possível editar o evento");
    }
  }
  async function handleInviteUser(formData, event_id) {
    try {
      await api.post(`/invites/${event_id}`, {
        invited_email: formData.invited_email,
      });
      alert("Convite enviado com sucesso");
    } catch (error) {
      alert("Não foi possível convidar o usuário");
    }
  }
  return (
    <div id="schedule">
      <NotificationsFloating
        invites={invites}
        active={showNotifications + ""}
      />
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-8 w-8"
                      src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                      alt="Workflow"
                    />
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {navigation.map((item, itemIdx) =>
                        itemIdx === 0 ? (
                          <Fragment key={item}>
                            {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                            <a
                              href={`#${item.toLowerCase()}`}
                              className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                              {item}
                            </a>
                          </Fragment>
                        ) : (
                          <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                          >
                            {item}
                          </a>
                        )
                      )}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    <button className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only">View notifications</span>
                      <BellIcon
                        className="h-6 w-6"
                        aria-hidden="true"
                        onClick={() => setShowNotifications(!showNotifications)}
                      />
                    </button>

                    {/* Profile dropdown */}
                    <Menu as="div" className="ml-3 relative">
                      {({ open }) => (
                        <>
                          <div>
                            <Menu.Button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                              <span className="sr-only">Open user menu</span>
                            </Menu.Button>
                          </div>
                          <Transition
                            show={open}
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items
                              static
                              className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                            >
                              {profile.map((item) => (
                                <Menu.Item key={item}>
                                  {({ active }) => (
                                    <a
                                      href="#"
                                      className={classNames(
                                        active ? "bg-gray-100" : "",
                                        "block px-4 py-2 text-sm text-gray-700"
                                      )}
                                    >
                                      {item}
                                    </a>
                                  )}
                                </Menu.Item>
                              ))}
                            </Menu.Items>
                          </Transition>
                        </>
                      )}
                    </Menu>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navigation.map((item, itemIdx) =>
                  itemIdx === 0 ? (
                    <Fragment key={item}>
                      {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                      <a
                        href="#"
                        className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
                      >
                        {item}
                      </a>
                    </Fragment>
                  ) : (
                    <a
                      key={item}
                      href="#"
                      className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      {item}
                    </a>
                  )
                )}
              </div>
              <div className="pt-4 pb-3 border-t border-gray-700">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0 bg-gray"></div>
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-white">
                      {user?.name}
                    </div>
                    <div className="text-sm font-medium leading-none text-gray-400">
                      {user?.email}
                    </div>
                  </div>
                  <button className="ml-auto bg-gray-800 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  {profile.map((item) => (
                    <a
                      onClick={
                        item === "Sign out" ? (e) => handleSignOut(e) : () => {}
                      }
                      key={item}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <header id="agenda" className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Agenda</h1>
        </div>
      </header>
      <main>
        <div>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="events border-4 border-dashed border-gray-200 rounded-lg">
                <h1 className="text-3xl font-bold text-gray-900">
                  Todos Eventos
                </h1>
                {data?.events.map((event) => (
                  <div key={event.id} className="event">
                    <header>
                      <h1>{event.name}</h1>
                    </header>
                    <p>{event.description}</p>
                    <div className="event-footer">
                      <div className="start">
                        <h1>Começa</h1>
                        <span className="date">{`${new Date(
                          event.start
                        ).getDay()}/${new Date(
                          event.start
                        ).getMonth()}/${new Date(
                          event.start
                        ).getFullYear()}`}</span>
                        <span className="hour">{`${
                          new Date(event.start).getHours() < 10 ? "0" : ""
                        }${new Date(event.start).getHours()}:${
                          new Date(event.start).getMinutes() < 10 ? "0" : ""
                        }${new Date(event.start).getMinutes()}`}</span>
                      </div>
                      <div className="end">
                        <h1>Termina</h1>
                        <span className="date">{`${new Date(
                          event.end
                        ).getDay()}/${new Date(
                          event.end
                        ).getMonth()}/${new Date(
                          event.end
                        ).getFullYear()}`}</span>
                        <span className="hour">{`${
                          new Date(event.end).getHours() < 10 ? "0" : ""
                        }${new Date(event.end).getHours()}:${
                          new Date(event.end).getMinutes() < 10 ? "0" : ""
                        }${new Date(event.end).getMinutes()}`}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {data?.invites.map((event) => (
                  <div key={event.id} className="event">
                    <h1>{event.name}</h1>
                    <p>{event.description}</p>
                    <div className="event-footer">
                      <div className="start">
                        <h1>Começa</h1>
                        <span className="date">{`${new Date(
                          event.start
                        ).getDay()}/${new Date(
                          event.start
                        ).getMonth()}/${new Date(
                          event.start
                        ).getFullYear()}`}</span>
                        <span className="hour">{`${
                          new Date(event.start).getHours() < 10 ? "0" : ""
                        }${new Date(event.start).getHours()}:${
                          new Date(event.start).getMinutes() < 10 ? "0" : ""
                        }${new Date(event.start).getMinutes()}`}</span>
                      </div>
                      <div className="end">
                        <h1>Termina</h1>
                        <span className="date">{`${new Date(
                          event.end
                        ).getDay()}/${new Date(
                          event.end
                        ).getMonth()}/${new Date(
                          event.end
                        ).getFullYear()}`}</span>
                        <span className="hour">{`${
                          new Date(event.end).getHours() < 10 ? "0" : ""
                        }${new Date(event.end).getHours()}:${
                          new Date(event.end).getMinutes() < 10 ? "0" : ""
                        }${new Date(event.end).getMinutes()}`}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* /End replace */}
          </div>
          <header id="eventos" className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <div
                id="meus eventos"
                className="events border-4 border-dashed border-gray-200 rounded-lg"
              >
                <h1 className="text-3xl font-bold text-gray-900">
                  Meus Eventos
                </h1>
                {data?.events.map((event) => (
                  <div key={event.id}>
                    <form
                      onSubmit={handleSubmit((formData) =>
                        handleEditEvent(formData, event.id)
                      )}
                      className="event"
                    >
                      <header>
                        {editEvent === event.id ? (
                          <input
                            {...register("name")}
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="current-name"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder={event.name}
                          />
                        ) : (
                          <h1>{event.name}</h1>
                        )}
                        <div className="manage-event">
                          <button type="submit">
                            <CheckIcon className="icon" />
                          </button>
                          <PencilIcon
                            className="icon"
                            onClick={() => {
                              editEvent === event.id
                                ? setEditEvent(null)
                                : setEditEvent(event.id);
                            }}
                          />
                          <XIcon
                            className="icon"
                            onClick={() => handleExcludeEvent(event.id)}
                          />
                        </div>
                      </header>
                      {editEvent === event.id ? (
                        <input
                          {...register("description")}
                          id="description"
                          name="description"
                          type="text"
                          autoComplete="current-description"
                          required
                          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                          placeholder={event.description}
                        />
                      ) : (
                        <p>{event.description}</p>
                      )}
                      <div className="event-footer">
                        <div className="start">
                          <h1>Começa</h1>
                          {editEvent === event.id ? (
                            <input
                              {...register("start")}
                              id="start"
                              name="start"
                              type="datetime-local"
                              autoComplete="current-start"
                              required
                              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                              placeholder={event.start}
                            />
                          ) : (
                            <>
                              <span className="date">{`${new Date(
                                event.start
                              ).getDay()}/${new Date(
                                event.start
                              ).getMonth()}/${new Date(
                                event.start
                              ).getFullYear()}`}</span>
                              <span className="hour">{`${
                                new Date(event.start).getHours() < 10 ? "0" : ""
                              }${new Date(event.start).getHours()}:${
                                new Date(event.start).getMinutes() < 10
                                  ? "0"
                                  : ""
                              }${new Date(event.start).getMinutes()}`}</span>
                            </>
                          )}
                        </div>
                        <div className="end">
                          <h1>Termina</h1>
                          {editEvent === event.id ? (
                            <input
                              {...register("end")}
                              id="end"
                              name="end"
                              type="datetime-local"
                              autoComplete="current-end"
                              required
                              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                              placeholder={event.end}
                            />
                          ) : (
                            <>
                              <span className="date">{`${new Date(
                                event.end
                              ).getDay()}/${new Date(
                                event.end
                              ).getMonth()}/${new Date(
                                event.end
                              ).getFullYear()}`}</span>
                              <span className="hour">{`${
                                new Date(event.end).getHours() < 10 ? "0" : ""
                              }${new Date(event.end).getHours()}:${
                                new Date(event.end).getMinutes() < 10 ? "0" : ""
                              }${new Date(event.end).getMinutes()}`}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </form>
                    {editEvent === event.id ? (
                      <form
                        onSubmit={handleSubmit((formData) =>
                          handleInviteUser(formData, event.id)
                        )}
                      >
                        <label htmlFor="invited_email">
                          Email para convite
                        </label>
                        <input
                          {...register("invited_email")}
                          id="invited_email"
                          name="invited_email"
                          type="email"
                          autoComplete="current-invited_email"
                          required
                          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                          placeholder="Digite o email para convite"
                        />
                        <button type="submit">
                          <CheckIcon className="icon" />
                        </button>
                      </form>
                    ) : (
                      <></>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </header>
        </div>
        <AddEventFloating events={data?.events} active={showAddEvent + ""} />
      </main>
      <PlusIcon id="addicon" onClick={handleShowAddEvent} />
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const { ["eventme.token"]: token } = parseCookies(ctx);
  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
