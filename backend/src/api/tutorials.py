from fastapi import APIRouter
from ..api_types import CamelModel
# from ..db import Database

router = APIRouter()


class Link(CamelModel):
    url: str
    title: str

class Tutorial(CamelModel):
    header: str | None = None
    title: str | None = None
    summary: str | None = None
    links: list[Link] | None = None

class MultipleTutorials(CamelModel):
    tutorials: list[Tutorial] | None = None





@router.get("/tutorials", response_model=list[Tutorial])
def get_all_tutorials():
    return [
        Tutorial(title="Tutorial Page", summary="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce gravida tristique est, a sollicitudin nulla varius ac. Duis sed lacus arcu. Mauris eget condimentum justo. Vestibulum iaculis cursus accumsan. Mauris eget diam consequat, viverra dui malesuada, maximus nisl. Etiam laoreet venenatis odio ut tempus. Praesent risus est, eleifend id purus non, varius rutrum nisi. Fusce sagittis lorem nec tristique efficitur. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam pretium, sapien et volutpat tempus, elit urna congue massa, id consequat leo dolor in ligula. Sed vestibulum tristique eros eu aliquet."),
        Tutorial(title="Tutorial 2", summary="Future links to second tutorial page", links=[
                Link(url="url1", title="Link 1"),
                Link(url="url2", title="Link 2"),
            ]
        ),
        Tutorial(title="Tutorial 3", summary="Future links to third tutorial page", links=[
                Link(url="url3", title="Link 3"),
                Link(url="url4", title="Link 4"),
            ]
        ),
        Tutorial(title="Tutorial 4", summary="Future links to forth tutorial page", links=[
                Link(url="url5", title="Link 5"),
                Link(url="url6", title="Link 6"),
            ]
        )
    ]


    # try:
    #     with Database() as db:
    #         query = """SELECT name as species_name FROM species"""
    #         entry_sql = db.execute_return(query)
    #         if entry_sql is not None:
    #             for d in entry_sql:

    #             return [d[0] for d in entry_sql]
    # except Exception:
    #     return

