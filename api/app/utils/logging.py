import logging
import sys

logger = logging.getLogger(__name__)

_CONFIGURED = False


class _ColorFormatter(logging.Formatter):
    RESET = "\033[0m"
    COLORS = {
        "DEBUG": "\033[36m",  # cyan
        "INFO": "\033[32m",  # green
        "WARNING": "\033[33m",  # yellow
        "ERROR": "\033[31m",  # red
        "CRITICAL": "\033[41m",  # red background
    }
    LOGGER_COLORS = {
        # Known external emitters
        "werkzeug": "\033[35m",  # magenta
        "sqlalchemy": "\033[34m",  # blue
        # Project emitters
        "app": "\033[36m",  # cyan
    }

    def _color_for_logger(self, logger_name: str) -> str:
        for prefix, color in self.LOGGER_COLORS.items():
            if logger_name.startswith(prefix):
                return color
        return ""

    def format(self, record: logging.LogRecord) -> str:
        original_levelname = record.levelname
        original_name = record.name

        level_color = self.COLORS.get(original_levelname, "")
        name_color = self._color_for_logger(original_name)

        try:
            if level_color:
                record.levelname = f"{level_color}{original_levelname}{self.RESET}"
            if name_color:
                record.name = f"{name_color}{original_name}{self.RESET}"
            return super().format(record)
        finally:
            # Restore original values to avoid leaking state to other handlers
            record.levelname = original_levelname
            record.name = original_name


def _supports_color(stream) -> bool:
    return hasattr(stream, "isatty") and stream.isatty()


def configure_logging(app=None) -> None:
    global _CONFIGURED
    if _CONFIGURED:
        return

    stream = sys.stderr
    handler = logging.StreamHandler(stream)

    fmt = "%(asctime)s | %(levelname)s | %(name)s: %(message)s"
    datefmt = "%H:%M:%S"
    if _supports_color(stream):
        handler.setFormatter(_ColorFormatter(fmt=fmt, datefmt=datefmt))
    else:
        handler.setFormatter(logging.Formatter(fmt=fmt, datefmt=datefmt))

    root = logging.getLogger()
    if not root.handlers:
        root.addHandler(handler)

    debug = bool(app and app.config.get("DEBUG"))
    root.setLevel(logging.DEBUG if debug else logging.INFO)

    # Flask's built-in server logger
    werkzeug = logging.getLogger("werkzeug")
    werkzeug.setLevel(logging.INFO if debug else logging.WARNING)

    # SQLAlchemy: show SQL in dev, keep quiet in prod
    sa_engine = logging.getLogger("sqlalchemy.engine")
    sa_engine.setLevel(logging.INFO if debug else logging.WARNING)
    sa_pool = logging.getLogger("sqlalchemy.pool")
    sa_pool.setLevel(logging.WARNING)

    _CONFIGURED = True
